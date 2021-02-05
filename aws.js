const app = require('express')()
const cors = require("cors")
const bodyParser = require("body-parser")

app.use(
  cors(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
)

app.listen(4000, () => {
  console.log("running on port 4000")
})


const aws = require('aws-sdk')
require('dotenv').config()
aws.config.update({ region: 'us-east-2' })
const config = new aws.Config({
  region: process.env.DEFAULT_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
let s3 = new aws.S3()


const client = new aws.Rekognition()
bucketParams = {
  Bucket: 'uploadexamples3',
}

let result = []
function ResultPush(key) { 
  result.push(key)
}

app.get('/', async (req, res) => {
  try {
    let final
    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err)
      } else {
        data.Contents.forEach(img => {
          client.compareFaces({
            SourceImage: {
              S3Object: {
                Bucket: 'uploadexamples3',
                Name: 'faustao.png'
              }
            },
            TargetImage: {
              S3Object: {
                Bucket: "uploadexamples3",
                Name: img.Key
              }
            },
            SimilarityThreshold: 70
          }, function (e, r) {
            if (e) {
              console.log(e)
            } else {
              if (r.FaceMatches.length > 0) {
                ResultPush(img.Key)
                // console.log('face found in: ' + 'https://uploadexamples3.s3.us-east-2.amazonaws.com/' + img.Key)
              } else {
                console.log('no matches ' )
              }
            }
          })
        })
      }
    })
    res.send(result)
  } catch (e) {
    console.log(e)
  }

})