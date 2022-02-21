const express = require('express');
const path = require('path')
var public = path.join(__dirname, 'public');


const PORT = process.env.PORT || 8080

const app = express()

app.get('/', (req, res) => {
  res.sendFile("index.html", {root:"public"})
})

app.use('/', express.static(public));


// async function callApi() {
//   const user = await Auth.currentAuthenticatedUser()
//   const token = user.signInUserSession.idToken.jwtToken
//   const requestData = {
//     headers: {
//       Authorization: token
//     }
//   }
//   const data = await API.get('testrestapi', '/hello', requestData)
//   console.log("data: ", data)
// }


// To use Routes 
app.get('/api', (req, res) => {
 res.json({success: true})
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

