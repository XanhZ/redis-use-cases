import { StatusCodes } from 'http-status-codes'
import { HttpError } from './http-error'

export class UnauthorizedError extends HttpError {
	constructor() {
		super('Unauthorized', StatusCodes.UNAUTHORIZED)
	}
}
