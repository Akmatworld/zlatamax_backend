import express from 'express'
import { dirname, join } from 'path'
import {fileURLToPath} from "url";

import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {steel, knives, trademark} from "./data.mjs";

const app = express()
const port = 8000


app.use(cors())
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
    let { trademark, inStock, steel, rating, searchText } = req.query;

    steel     = steel ? JSON.parse(steel) : [];
    trademark = trademark ? JSON.parse(trademark) : [];
    rating    = rating ? JSON.parse(rating) : [];

    const filteredKnives = knives.filter((knife) => {
        let isMatch = true;

        // Фильтрация по марке, если параметр передан
        if (searchText) {
            if (knife.name.includes(searchText) === false && knife.article.includes(searchText) === false) {
                isMatch = false;
            }
        }

        // Фильтрация по марке, если параметр передан
        if (Array.isArray(trademark) && trademark?.length && !trademark.includes(knife.trademark)) {
            isMatch = false;
        }

        // Фильтрация по наличию, если параметр передан
        if (inStock && knife.inStock !== (inStock === 'true')) {
            isMatch = false;
        }

        // Фильтрация по стали, если параметр передан
        if (Array.isArray(steel) && steel.length && !steel.includes(knife.steel)) {
            isMatch = false;
        }

        // Фильтрация по рейтингу, если параметр передан
        if (Array.isArray(rating) && rating?.length && !rating.includes(knife.rating)) {
            isMatch = false;
        }

        return isMatch;
    })

    res.status(200).json(filteredKnives)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
