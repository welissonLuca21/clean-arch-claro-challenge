import ENV from '@/config/env'
import sendgrid from '@sendgrid/mail'
import { Service } from 'typedi'

const from = ENV.SENDGRID.FROM

@Service()
export class SendgridProvider {
  constructor() {
    sendgrid.setApiKey(ENV.SENDGRID.API_KEY)
  }

  sendAccountConfirmationEmail = async (
    params: sendEmailConfirmationParams
  ) => {
    const template = {
      link: `${ENV.API_URL}/api/user/verify/${params.token}`,
      subject: 'Confirme sua conta'
    }

    const payload = {
      from,
      to: params.to,
      templateId: ENV.SENDGRID.TEMPLATES.SIGNUP_TEMPLATE,
      dynamicTemplateData: template
    }

    await sendgrid.send(payload)
  }
}

type sendEmailConfirmationParams = {
  to: string
  token: string
}
