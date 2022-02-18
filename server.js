const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 8080



app.use(express.static('public'))

// To use Routes 
app.get('/api', (req, res) => {
 res.json({success: true})
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

