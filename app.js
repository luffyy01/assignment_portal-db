const express = require('express')
const db = require('./db')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Assignment portal API is running' })
})

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.json({})
})

app.post('/assignments', async (req, res) => {
    try {
        const { title, deadline } = req.body
        const sql = 'INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *'
        const { rows } = await db.query(sql, [title, deadline])
        
        res.status(201).json(rows[0])
    } catch (e) {
        res.status(500).send('server error')
    }
})

app.get('/assignments', async (req, res) => {
    try {
        let sql = 'SELECT * FROM assignments'
        const params = []

        if (req.query.submitted) {
            sql += ' WHERE submitted = $1'
            params.push(req.query.submitted === 'true')
        }

        sql += ' ORDER BY id DESC'
        
        const { rows } = await db.query(sql, params)
        res.json(rows)
    } catch (e) {
        res.status(500).send('server error')
    }
})

app.patch('/assignments/:id', async (req, res) => {
    try {
        const sql = 'UPDATE assignments SET submitted = true WHERE id = $1 RETURNING *'
        const { rows } = await db.query(sql, [req.params.id])
        
        if (!rows.length) {
            return res.status(404).json({ message: 'Assignment not found' })
        }
        
        res.json(rows[0])
    } catch (e) {
        res.status(500).send('server error')
    }
})

app.delete('/assignments/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM assignments WHERE id = $1 RETURNING *'
        const { rows } = await db.query(sql, [req.params.id])
        
        if (!rows.length) {
            return res.status(404).json({ message: 'Assignment not found' })
        }
        
        res.json({
            message: 'Assignment deleted successfully',
            assignment: rows[0]
        })
    } catch (e) {
        res.status(500).send('server error')
    }
})

app.listen(3000, () => console.log('server started on port 3000'))