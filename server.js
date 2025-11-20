// C:\Users\Zane\Desktop\chicken-tracker\backend\server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 9000;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Chicken Tracker API Server',
        endpoints: {
            getProductions: 'GET /api/productions',
            createProduction: 'POST /api/productions',
            saveData: 'POST /api/tracker/save',
            loadData: 'GET /api/tracker/load?productionId=ID',
            deleteProduction: 'DELETE /api/productions/:productionId'
        },
        status: 'Server is running'
    });
});

// Get all productions
app.get('/api/productions', (req, res) => {
    try {
        const files = fs.readdirSync(DATA_DIR);
        const productions = files
            .filter(file => file.endsWith('.json'))
            .map(file => ({
                id: file.replace('.json', ''),
                name: file.replace('.json', '').replace(/_/g, ' '),
                created: fs.statSync(path.join(DATA_DIR, file)).birthtime
            }));
        res.json(productions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read productions' });
    }
});

// Create new production
app.post('/api/productions', (req, res) => {
    try {
        const { productionId, productionName } = req.body;
        const fileName = `${productionId}.json`;
        const filePath = path.join(DATA_DIR, fileName);
        
        if (fs.existsSync(filePath)) {
            return res.status(400).json({ error: 'Production already exists' });
        }
        
        const initialData = {
            productionId,
            productionName,
            created: new Date().toISOString(),
            settings: {},
            days: []
        };
        
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        res.json({ success: true, production: initialData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create production' });
    }
});

// Save production data
app.post('/api/tracker/save', (req, res) => {
    try {
        const data = req.body;
        const fileName = `${data.productionId}.json`;
        const filePath = path.join(DATA_DIR, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Load production data
app.get('/api/tracker/load', (req, res) => {
    try {
        const { productionId } = req.query;
        const fileName = `${productionId}.json`;
        const filePath = path.join(DATA_DIR, fileName);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Production not found' });
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Delete production
app.delete('/api/productions/:productionId', (req, res) => {
    try {
        const { productionId } = req.params;
        const fileName = `${productionId}.json`;
        const filePath = path.join(DATA_DIR, fileName);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Production not found' });
        }
        
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete production' });
    }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});