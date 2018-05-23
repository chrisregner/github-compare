import axios from 'axios'
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions'

/* API Constants */
const API_BASE = 'https://api.github.com'
const ENDPOINT_SEARCH = '/search/repositories'

/* API-Specific HTTP function */
const http = axios.create({
  baseURL: API_BASE,
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter, true)),
})

/* API Function(s) */
export const search = q => http.get(ENDPOINT_SEARCH, { params: { q } })
