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

function getFaces(img) {
  result = []
  for (let i = 0; i < img.length; i++) {
    const image = img[i]
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
          Name: image.Key
        }
      },
      SimilarityThreshold: 70
    }, function (e, r) {
      if (e) {
        console.log(e)
      } else {
        if (r.FaceMatches.length > 0) {
          ResultPush('https://uploadexamples3.s3.us-east-2.amazonaws.com/' + image.Key)
        } else {
          console.log('no matches in ' + image.Key)
        }
      }
    })
  }
  return result
}

app.get('/', async (req, res) => {
  try {
    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err)
      } else {
        getFaces(data.Contents)
      }
    })
    res.send(result)
  } catch (e) {
    console.log(e)
  }
})