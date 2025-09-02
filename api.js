const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const JWT_SECRET = 'kod';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kosarkaski_klub',
  password: 'nada1234',
  port: 5432,
});

// --- JWT Middleware ---
function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

// --- Admin check middleware ---
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden: Admins only' });
  }
  next();
}

// --- MULTER konfiguracija za upload ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- UPLOAD slika (URL fajla) ---
router.post('/uploads', jwtMiddleware, isAdmin, upload.single('slika'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Nema fajla' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- GET svi igrači ---
router.get('/players', jwtMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM igrac ORDER BY broj_dresa ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Greška pri učitavanju igrača' });
  }
});

// --- POST novi igrač ---
router.post('/players', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    const { ime, prezime, pozicija, broj_dresa, datum_rodjenja, slika } = req.body;
    if (!ime || !prezime || !pozicija) {
      return res.status(400).json({ msg: 'Nedostaju obavezna polja' });
    }
    const sql = `
      INSERT INTO igrac (ime, prezime, pozicija, broj_dresa, datum_rodjenja, slika)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [
      ime,
      prezime,
      pozicija,
      broj_dresa || null,
      datum_rodjenja || null,
      slika?.trim() || null
    ];
    const { rows } = await pool.query(sql, values);
    res.status(201).json({ msg: 'Igrač dodat', id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Greška pri dodavanju igrača' });
  }
});

// --- DELETE igrač ---
router.delete('/players/:id', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM igrac WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Igrač obrisan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Greška pri brisanju igrača' });
  }
});

// --- VIJESTI ---
router.get('/novosti', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vijest ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Greška pri učitavanju vijesti' });
  }
});

router.post('/novosti', jwtMiddleware, isAdmin, async (req, res) => {
  const { naslov, sadrzaj, slika } = req.body;
  if (!naslov || !sadrzaj || !slika) {
    return res.status(400).json({ msg: 'Nedostaju podaci' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO vijest (naslov, sadrzaj, slika) VALUES ($1, $2, $3) RETURNING id',
      [naslov, sadrzaj, slika]
    );
    res.status(201).json({ msg: 'Vijest dodata', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Greška pri dodavanju vijesti' });
  }
});

router.delete('/novosti/:id', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM vijest WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Vijest obrisana' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Greška pri brisanju vijesti' });
  }
});
// ===== GALERIJA =====

// helper: čisti odgovor za grešku
function sendErr(res, code, msg) {
  return res.status(code).json({ msg });
}

// POST /galerija  (upload slike u /uploads + INSERT u galerija.slika)

router.post(
  '/galerija',
  jwtMiddleware,         
  isAdmin,               
  upload.single('slika'),
  async (req, res) => {
    try {
      console.log('=== /galerija POST ===');
      console.log('Auth user:', req.user);
      console.log('req.file:', req.file);

      if (!req.file) {
        return sendErr(res, 400, 'Nema fajla (field slika)');
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const q = 'INSERT INTO galerija (slika) VALUES ($1) RETURNING id, slika';
      const params = [imageUrl];

      const result = await pool.query(q, params);
      console.log('INSERT OK:', result.rows[0]);

      return res.status(201).json({
        msg: 'Slika dodata u galeriju',
        ...result.rows[0],
      });
    } catch (err) {
      console.error('GREŠKA U /galerija POST:', err.message, err.stack);
      return sendErr(res, 500, 'Greška pri dodavanju slike u galeriju');
    }
  }
);

// GET /galerija  (lista)
router.get('/galerija', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, slika FROM galerija ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GREŠKA U /galerija GET:', err.message, err.stack);
    res.status(500).json({ msg: 'Greška pri učitavanju galerije' });
  }
});

// DELETE /galerija/:id
router.delete('/galerija/:id', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return sendErr(res, 400, 'Pogrešan ID');

    await pool.query('DELETE FROM galerija WHERE id = $1', [id]);
    res.json({ msg: 'Slika obrisana' });
  } catch (err) {
    console.error('GREŠKA U /galerija DELETE:', err.message, err.stack);
    res.status(500).json({ msg: 'Greška pri brisanju slike' });
  }
  });

  
// ===============================
// TABELA (pozicija, klub, poeni)
// ===============================

// SVI REDOVI – javno
router.get('/tabela', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, pozicija, klub, poeni FROM tabela ORDER BY pozicija ASC, poeni DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /tabela error:', err);
    res.status(500).json({ msg: 'Greška pri učitavanju tabele' });
  }
});

// DODAJ RED – admin
router.post('/tabela', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    const { pozicija, klub, poeni } = req.body;
    if (pozicija === undefined || !klub || poeni === undefined) {
      return res.status(400).json({ msg: 'Nedostaju polja (pozicija, klub, poeni)' });
    }

    const { rows } = await pool.query(
      `INSERT INTO tabela (pozicija, klub, poeni)
       VALUES ($1, $2, $3)
       RETURNING id, pozicija, klub, poeni`,
      [Number(pozicija), String(klub), Number(poeni)]
    );

    res.status(201).json({ msg: 'Red dodat', row: rows[0] });
  } catch (err) {
    console.error('POST /tabela error:', err);
    res.status(500).json({ msg: 'Greška pri dodavanju reda' });
  }
});

// IZMIJENI RED – admin
router.put('/tabela/:id', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { pozicija, klub, poeni } = req.body;

    const { rows } = await pool.query(
      `UPDATE tabela
       SET pozicija = $1, klub = $2, poeni = $3
       WHERE id = $4
       RETURNING id, pozicija, klub, poeni`,
      [Number(pozicija), String(klub), Number(poeni), Number(id)]
    );

    if (!rows[0]) return res.status(404).json({ msg: 'Red ne postoji' });

    res.json({ msg: 'Ažurirano', row: rows[0] });
  } catch (err) {
    console.error('PUT /tabela error:', err);
    res.status(500).json({ msg: 'Greška pri ažuriranju' });
  }
});

// OBRIŠI RED – admin
router.delete('/tabela/:id', jwtMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tabela WHERE id = $1', [Number(id)]);
    res.json({ msg: 'Obrisano' });
  } catch (err) {
    console.error('DELETE /tabela error:', err);
    res.status(500).json({ msg: 'Greška pri brisanju' });
  }
});


// GET svi treneri
router.get("/treneri", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM treneri ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Greška GET /treneri:", err);
    res.status(500).json({ msg: "Greška servera" });
  }
});

// POST novi trener
router.post(
  "/treneri",
  jwtMiddleware,
  isAdmin,
  upload.single("slika"),
  async (req, res) => {
    try {
      const { ime, prezime, uloga } = req.body;
      const slika = req.file ? `/uploads/${req.file.filename}` : null;

      await pool.query(
        "INSERT INTO treneri (ime, prezime, uloga, slika) VALUES ($1, $2, $3, $4)",
        [ime, prezime, uloga, slika]
      );
      res.json({ msg: "Trener dodat" });
    } catch (err) {
      console.error("Greška POST /treneri:", err);
      res.status(500).json({ msg: "Greška pri dodavanju" });
    }
  }
);

// DELETE trener
router.delete("/treneri/:id", jwtMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM treneri WHERE id = $1", [id]);
    res.json({ msg: "Trener obrisan" });
  } catch (err) {
    console.error("Greška DELETE /treneri:", err);
    res.status(500).json({ msg: "Greška pri brisanju" });
  }
});  

// --- GLOBAL SEARCH (public) — IGRACI, TRENERI, VIJESTI ---
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const like = `%${q}%`;

  const result = { igraci: [], treneri: [], vijesti: [] };
  if (!q) return res.json(result);

  // IGRAČI
  try {
    const { rows } = await pool.query(
      `SELECT id, ime, prezime, pozicija, broj_dresa, datum_rodjenja, slika
       FROM igrac
       WHERE (ime || ' ' || prezime) ILIKE $1
          OR ime ILIKE $1
          OR prezime ILIKE $1
          OR pozicija ILIKE $1
          OR CAST(broj_dresa AS TEXT) ILIKE $1
       ORDER BY prezime ASC, ime ASC
       LIMIT $2`,
      [like, limit]
    );
    result.igraci = rows;
  } catch (err) {
    console.error('SEARCH igraci error:', err);
  }

  
  try {
    let rows = [];

    
    try {
      ({ rows } = await pool.query(
        `SELECT id, ime, prezime, uloga, slika, datum_rodjenja
         FROM treneri
         WHERE (ime || ' ' || prezime) ILIKE $1
            OR ime ILIKE $1
            OR prezime ILIKE $1
            OR uloga ILIKE $1
         ORDER BY prezime ASC, ime ASC
         LIMIT $2`,
        [like, limit]
      ));
    } catch {
    
      try {
        const r = await pool.query(
          `SELECT id, ime, prezime, uloga, slika
           FROM treneri
           WHERE (ime || ' ' || prezime) ILIKE $1
              OR ime ILIKE $1
              OR prezime ILIKE $1
              OR uloga ILIKE $1
           ORDER BY prezime ASC, ime ASC
           LIMIT $2`,
          [like, limit]
        );
        rows = r.rows.map(x => ({ ...x, datum_rodjenja: null }));
      } catch {}
    }

    
    if (!rows || rows.length === 0) {
      
      try {
        const r2 = await pool.query(
          `SELECT id, ime, prezime, uloga, slika, datum_rodjenja
           FROM trener
           WHERE (ime || ' ' || prezime) ILIKE $1
              OR ime ILIKE $1
              OR prezime ILIKE $1
              OR uloga ILIKE $1
           ORDER BY prezime ASC, ime ASC
           LIMIT $2`,
          [like, limit]
        );
        rows = r2.rows;
      } catch {
        
        try {
          const r3 = await pool.query(
            `SELECT id, ime, prezime, uloga, slika
             FROM trener
             WHERE (ime || ' ' || prezime) ILIKE $1
                OR ime ILIKE $1
                OR prezime ILIKE $1
                OR uloga ILIKE $1
             ORDER BY prezime ASC, ime ASC
             LIMIT $2`,
            [like, limit]
          );
          rows = r3.rows.map(x => ({ ...x, datum_rodjenja: null }));
        } catch (e3) {
          console.error('SEARCH trener error:', e3);
        }
      }
    }

    result.treneri = rows || [];
  } catch (err) {
    console.error('SEARCH trener(i) wrapper error:', err);
  }

  // VIJESTI
  try {
    const { rows } = await pool.query(
      `SELECT id, naslov, sadrzaj, slika
       FROM vijest
       WHERE naslov ILIKE $1 OR sadrzaj ILIKE $1
       ORDER BY id DESC
       LIMIT $2`,
      [like, limit]
    );
    result.vijesti = rows;
  } catch (err) {
    console.error('SEARCH vijesti error:', err);
  }

  return res.json(result);
});



module.exports = router;
