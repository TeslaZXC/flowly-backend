import {VKApi, ConsoleLogger} from 'node-vk-sdk'

let api = new VKApi({
    logger: new ConsoleLogger()
})

api.usersGet({ userIds: ['1'] })
    .then(response => {
        console.log(response)
    })