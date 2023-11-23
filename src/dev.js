import { getData } from './data.js'
import _ from 'lodash'

async function run() {

let companies = await getData()

let a = _.find(companies, { name: 'BABA' })
    console.log(a.code)
}

run()
