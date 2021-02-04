const { FaceClient, FaceModels } = require('@azure/cognitiveservices-face')
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js")
require('dotenv').config()

async function main() {
  const faceKey = process.env.FACE_KEY
  const faceEndPoint = process.env.FACE_ENDPOINT
  const cognitiveServiceCredentials = new CognitiveServicesCredentials(faceKey)
  const client = new FaceClient(cognitiveServiceCredentials, faceEndPoint)

  //original
  const url = "https://pbs.twimg.com/media/EslEc_6XAAAKgch?format=jpg&name=large"
  //comnpare
  const url2 = "https://scontent.fsdu11-1.fna.fbcdn.net/v/t1.0-9/122685097_2177164319095320_2613825473942854334_o.jpg?_nc_cat=106&ccb=2&_nc_sid=84a396&_nc_eui2=AeHPnJpNxwkFfj4hXhC42J6GE1AhErQf4KETUCEStB_gobXRXbiJxcfnci1TrdkSwzHKeppzLf1fSyNqXjtD8WJJ&_nc_ohc=8oddSm1BDjYAX__QU4u&_nc_ht=scontent.fsdu11-1.fna&oh=14313a172b67d0129dd2a0c0911d91c8&oe=603E7F03"

  // const compare = 'https://pbs.twimg.com/profile_images/1356257939020013569/TNbMWiG8_400x400.jpg'

  const compare = [
    'https://pbs.twimg.com/profile_images/1356257939020013569/TNbMWiG8_400x400.jpg',
    "https://pbs.twimg.com/media/EslEc_6XAAAKgch?format=jpg&name=large",
    'https://scontent-gig2-1.xx.fbcdn.net/v/t1.0-9/49704210_2260314967515242_6070140862132649984_o.jpg?_nc_cat=111&ccb=2&_nc_sid=174925&_nc_eui2=AeGIAHkGGw_7-ugwd_unqLt-p5G_M-M0-oCnkb8z4zT6gMTsbUKYgQq27ey9cVbHVU84ABc2XxC-b4WWlpvyVG1I&_nc_ohc=MpJ0cdRYcLUAX-qkNaX&_nc_ht=scontent-gig2-1.xx&oh=03d3dc8e921bac6c6ef726069ebfb530&oe=6040D51A',
    'https://s2.glbimg.com/scG7dt_aHq0ypN4KHPHLDtbw_Fo=/e.glbimg.com/og/ed/f/original/2020/11/01/celso-portiolli-2020.jpg'
  ]
  let attributes = ["age", "gender", "hair", "emotion"]

  const options = {
    returnFaceLandmarks: true,
    returnFaceAttributes: attributes
  }

  const optionsCreate = {
    name: 'teste',
    userData: 'recognition_01'
  }

  // client.faceList.create('teste', optionsCreate)
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))

  // client.faceList.get('teste')
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))

  // client.faceList.addFaceFromUrl('teste','https://scontent.fsdu11-1.fna.fbcdn.net/v/t1.0-9/78115972_2484214845125252_5405908501765554176_o.jpg?_nc_cat=107&ccb=2&_nc_sid=84a396&_nc_eui2=AeGHc1mojC-Rcrm2QDmhNciTHJ1iojJXzo4cnWKiMlfOjiKvBbnLEovkfPJm5MkgPevBT3gjzGXzxUUqWgsT9Yod&_nc_ohc=a2ET3ruOyr0AX-JflJu&_nc_ht=scontent.fsdu11-1.fna&oh=a222fd36ebd2b261e3412fdab8123af8&oe=603EEF65').then(res => console.log(res))


  async function check(id, image) {
    await client.face.findSimilar(id, { faceListId: 'teste' })
      .then(res => {
       console.log(res)
      })
      .catch(e => console.log(e))
  }
  compare.forEach(url => {
    client.face.detectWithUrl(url, options)
      .then(res => {
        res.forEach(f => {
          check(f.faceId, url)
        })
      })
  })
}

main()