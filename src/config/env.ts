const SENDGRID = {
  API_KEY: process.env.SENDGRID_API_KEY,
  FROM: process.env.SENDGRID_FROM,
  TEMPLATES: {
    SIGNUP_TEMPLATE: process.env.SENDGRID_SIGNUP_TEMPLATE
  }
}

export default {
  API_URL: process.env.API_URL,
  PORT: process.env.PORT || 9000,
  JWT_SECRET: process.env.JWT_SECRET,
  SENDGRID
}
