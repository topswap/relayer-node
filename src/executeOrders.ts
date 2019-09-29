import dotenv from 'dotenv'
import Web3 from 'web3'

import { init } from './database'
import Book from './book'
import Relayer from './relayer'
import Executor from './executor'

dotenv.config()

async function setupExecutor() {
  await init()
  const web3 = new Web3(process.env.WEB3_HTTP_RPC_URL)
  const book = new Book(web3)
  const relayer = new Relayer(web3)
  const executor = new Executor(book, relayer)

  async function watchOrders() {
    await executor.watchRound()
    setTimeout(watchOrders, 60000) // @TODO: on env var
  }

  await watchOrders()
}

if (require.main === module) {
  console.log('******** Starting Executor ********')
  Promise.resolve()
    .then(() => setupExecutor())
    .catch(console.error)
}