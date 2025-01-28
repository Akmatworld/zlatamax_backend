import express from 'express'
import { dirname, join } from 'path'
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {steel, knives, trademark} from "./data.mjs";

const app = express()
const port = 8000


app.use('/static', express.static(join(__dirname, 'static')))

app.get('/api/product/knives/:id', (req, res) => {
    const paramId = +req.params.id
    const knife = knives.find((item) => item.id === paramId)
    res.status(200).json(knife)
})

app.get('/api/product/steel', (req, res) => {
    res.status(200).json(steel)
})

app.get('/api/product/trademark', (req, res) => {
    res.status(200).json(trademark)
})

app.get('/api/product/knives', (req, res) => {
    const { trademark, inStock, steel, rating } = req.query;

    const filteredKnives = knives.filter((knife) => {
        let isMatch = true;

        // Фильтрация по марке, если параметр передан
        if (trademark && knife.trademark !== trademark) {
            isMatch = false;
        }

        // Фильтрация по наличию, если параметр передан
        if (inStock && knife.inStock !== (inStock === 'true')) {
            isMatch = false;
        }

        // Фильтрация по стали, если параметр передан
        if (steel && knife.steel !== steel) {
            isMatch = false;
        }

        // Фильтрация по рейтингу, если параметр передан
        if (rating && knife.rating !== parseInt(rating, 10)) {
            isMatch = false;
        }

        return isMatch;
    })

    res.status(200).json(filteredKnives)
})

app.get('/api/product/search', (req, res) => {
    const searchText = req.query.text

    const foundKnives = knives.filter((knife) => knife.name.includes(searchText) || knife.article.includes(searchText))

    res.status(200).json(foundKnives)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
