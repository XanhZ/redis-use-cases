import { Router } from 'express'
import { BookController, GoogleSheetController, UserController } from '../controllers'
import { createRateLimit } from '../middlewares'

export function initRoutes() {
	const router = Router()
	const bookController = new BookController()
  const userController = new UserController()
  const googleSheetController = new GoogleSheetController()

	router.get('/books', bookController.getBooks)
	router.get('/books/rate-limit', createRateLimit({ maxRequest: 1, second: 5 }), bookController.getBooksWithRatelimit)
  router.post('/books/pub-sub', bookController.publish)

  router.post('/users/login', userController.login)
  router.delete('/users/logout', userController.logout)

  router.post('/google-sheet/with-locker', googleSheetController.writeSheetWithRedlock)
  router.post('/google-sheet/without-locker', googleSheetController.writeSheetWithoutRedlock)

  return router
}
