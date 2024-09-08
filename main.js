const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const port = 8080

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

app.get('/:GameID', (req, res) => {

    console.log(req.params['GameID'])

    async function FetchData() {
        const server_result = await fetch(`https://games.roblox.com/v1/games/${req.params['GameID']}/servers/Public?sortOrder=Asc&limit=100`)
        const server_json = await server_result.json()

        if (server_json['data'] === undefined)
            return

        // Now fetch all the thumbnails

        server_json['thumbnails'] = []
        const thumbnail_body = []
        var num_thumbnails = 0

        for(const server_data of server_json['data']) {
            for (const token of server_data['playerTokens']) {
                thumbnail_body.push({
                    requestId: `0:${token}:AvatarHeadshot:150x150:webp:regular`,
                    type: "AvatarHeadshot",
                    targetId: 0,
                    token: token,
                    format: "webp",
                    size: "150x150"
                })
                num_thumbnails += 1

                if (num_thumbnails % 100 === 0) {
                    const thumbnail_result = await fetch(`https://thumbnails.roblox.com/v1/batch`, {body: JSON.stringify(thumbnail_body), method: 'POST'})
                    thumbnail_body.splice(0, thumbnail_body.length)

                    const thumbnail_json = await thumbnail_result.json()

                    for (const thumbnail of thumbnail_json['data']) {
                        const token = thumbnail['requestId'].split(':')[1]
                        server_json['thumbnails'].push({
                            'token': token,
                            'imageUrl': thumbnail['imageUrl']
                        })
                    }
                }
            }
        }

        // Get last thumbnails in queue
        const thumbnail_result = await fetch(`https://thumbnails.roblox.com/v1/batch`, {body: JSON.stringify(thumbnail_body), method: 'POST'})
         thumbnail_body.splice(0, thumbnail_body.length)
        const thumbnail_json = await thumbnail_result.json()

        for (const thumbnail of thumbnail_json['data']) {
            const token = thumbnail['requestId'].split(':')[1]
            server_json['thumbnails'].push({
                'token': token,
                'imageUrl': thumbnail['imageUrl']
            })
        }

        res.json(server_json)
    }

    FetchData()
})


app.listen(port,  () => {
    console.log(`Listening on port ${port}`)
})