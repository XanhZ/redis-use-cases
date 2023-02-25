import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RedlockConnection } from '../connections'
import { Controller, HttpCode } from '../decorators'
import { GoogleSheetService } from '../services'

@Controller()
export class GoogleSheetController {
	@HttpCode(StatusCodes.CREATED)
	public async writeSheetWithoutRedlock(req: Request) {
		const { body } = req
		const googleSheetService = GoogleSheetService.getInstance()
		await googleSheetService.addRow(body)
    return {
      message: 'OK'
    }
	}

	@HttpCode(StatusCodes.CREATED)
	public async writeSheetWithRedlock(req: Request) {
    const redlock = RedlockConnection.getInstance().getClient()
    const locker = await redlock.acquire(["write-google-sheet"], 5000)
    console.log(`[GOOGLE_SHEET_CONTROLLER]: Lock acquire`)
    try {
      const { body } = req
      const googleSheetService = GoogleSheetService.getInstance()
      await googleSheetService.addRow(body)
      return {
        message: 'OK'
      }
    } finally {
      await locker.release()
    }
	}
}
