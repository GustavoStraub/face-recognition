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
            console.log('face found in: ' + 'https://uploadexamples3.s3.us-east-2.amazonaws.com/' + img.Key)
          } else {
            console.log('no matches ' )
          }
        }
      })
    })
  }
})
