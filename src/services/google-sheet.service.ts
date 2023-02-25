import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { ConfigModule } from '../configs'
import credentials from '../credentials/google-sheet.json'

export class GoogleSheetService {
	private static _instance: GoogleSheetService

	private _doc: GoogleSpreadsheet
	private _sheet!: GoogleSpreadsheetWorksheet

	constructor() {
		const configModule = ConfigModule.getInstance()
		const docId = configModule.get('DOC_ID')
		this._doc = new GoogleSpreadsheet(docId)
	}

	public static getInstance() {
		if (!GoogleSheetService._instance) {
			GoogleSheetService._instance = new GoogleSheetService()
		}
		return GoogleSheetService._instance
	}

	public async init() {
    try {
      await this._doc.useServiceAccountAuth(credentials)
      await this._doc.loadInfo()
      const demoSheet = this._doc.sheetsByTitle['demo']
      if (demoSheet) {
        this._sheet = demoSheet
      } else {
        this._sheet = await this._doc.addSheet({
          title: 'demo',
          headerValues: ['name'],
        })
      }
    } catch (error: any) {
      console.error(`[GOOGLE_SHEET][ERROR]:`, error.toJSON())
    }
	}

	public addRow(row: any) {
		return this._sheet.addRow(row)
	}
}
