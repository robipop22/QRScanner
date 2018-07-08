export default api = (domain, api_key, api_password, scan_result) => {
	return `http://profit.ecomromania.com/qrscanner?domain=${domain}&api_key=${api_key}&api_password=${api_password}&scan_result=${scan_result}`
}