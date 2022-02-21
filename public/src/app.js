import Amplify, { Auth, Storage } from 'aws-amplify'
import awsconfig from './aws-exports'

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  }
}

Amplify.configure(updatedAwsConfig);

Amplify.configure(awsconfig)

const getElement = document.getElementById.bind(document)

const statusDiv = getElement('signin-status')

async function refreshGallery() {
  const galleryDiv = getElement('gallery')

  galleryDiv.innerHTML = ''

  const files = await Storage.list('')

  for (let file of files) {
    const image = document.createElement('img')

    image.src = await Storage.get(file.key)

    galleryDiv.appendChild(image)
  }
}

refreshGallery()

getElement('signup-button').addEventListener('click', async () => {
  const username = getElement('signup-username').value
  const email = getElement('signup-email').value
  const password = getElement('signup-password').value

  await Auth.signUp({ username, password, attributes: { email } })

  statusDiv.innerText = `Check "${email}" inbox for a confirmation code.`
})

getElement('confirm-signup-button').addEventListener('click', async () => {
  const code = getElement('signup-confirmation-code').value
  const username = getElement('signup-username').value

  await Auth.confirmSignUp(username, code)

  statusDiv.innerText = 'Sinup confirmed. You can sign in now.'
})

getElement('signin-button').addEventListener('click', async () => {
  const username = getElement('signin-username').value
  const password = getElement('signin-password').value

  const result = await Auth.signIn(username, password)

  statusDiv.innerText = 'Signed in as ' + result.username
})

getElement('upload-input').addEventListener('change', async (e) => {
  const [file] = e.target.files

  await Storage.put(file.name, file)

  await refreshGallery()
})