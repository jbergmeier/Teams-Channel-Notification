const axios = require("axios")
require("dotenv").config()

const teams_call = (params, callback) => {
    console.log(params)

    //Channel URL
    if(params.baseUrl) {
        var base_url = params.baseUrl
    }
    else{
        return callback({message: "Please provide a valid URL for the teams channel connector", statusCode: 400})
    }

    // const and variables for the calls
    let teams_call_color
    const color_error = 'd70000' // red
    const color_info = '00d712' // green
    const color_warning = 'd7cd00' // yellow
    const color_default = '0174DF' //blue

    let teams_call_image_url
    const image_url_warning = 'https://appublicstorage.blob.core.windows.net/share/phoenix_logo_yellow.png'
    const image_url_info = 'https://appublicstorage.blob.core.windows.net/share/phoenix_logo_green.png'
    const image_url_error = 'https://appublicstorage.blob.core.windows.net/share/phoenix_logo_red.png'
    const image_url_default = 'https://appublicstorage.blob.core.windows.net/share/phoenix_logo.png'

    // Placeholder Variables
    const current_dateTime_unix = Date.now()
    let current_dateTime = params.dateTime ? params.dateTime : new Date(current_dateTime_unix)
    let teams_call_title = params.title ? params.title : 'n/a'
    let teams_call_sub_title = params.subtitle ? params.subtitle : 'n/a'
    
    let teams_call_Type = params.type ? params.type :'n/a'
    let teams_call_level = params.level ? params.level.charAt(0).toUpperCase() + params.level.slice(1).toLowerCase() : 'Warning'
    console.log(teams_call_level)
    let teams_call_summary = params.summary ? params.summary : 'No Summary'
    let teams_call_description = params.description ? params.description : 'n/a'
    
    switch(params.level.toLowerCase()) {
            case 'info':
                teams_call_color = color_info
                teams_call_image_url = params.image ? params.image : image_url_info
                break;

            case 'warning':
                teams_call_color = color_warning
                teams_call_image_url = params.image ? params.image : image_url_warning
                break;

            case 'error':
                teams_call_color = color_error
                teams_call_image_url = params.image ? params.image : image_url_error
                break;

            case 'critical':
                teams_call_color = color_error
                teams_call_image_url = params.image ? params.image : image_url_error
                break;
     
            default:
                teams_call_color = color_default
                teams_call_image_url = params.image ? params.image : image_url_default
                break;
        }
    
    // MessageCard Body    
    const json_body = {
        "@type": "MessageCard", 
        "@context": "http://schema.org/extensions",
        "themeColor": `${teams_call_color}`,
        "summary": `${teams_call_summary}`,
        "sections": [{
            "activityTitle": `${teams_call_level} - ${teams_call_title}`,
            "activitySubtitle": `${teams_call_sub_title}`,
            "activityImage": `${teams_call_image_url}`,
            "facts": [{
                "name": "Description",
                "value": `${teams_call_description}`
            }, {
                "name": "DateTime",
                "value": current_dateTime.toLocaleDateString() + " | " + current_dateTime.toLocaleTimeString()
            }, {
                "name": "Type",
                "value": `${teams_call_Type}`
            }],
            "markdown": true
        }]
    }

    //Send a POST request to Teams Channel
    axios({
        method: 'post',
        url: base_url,
        data: json_body
    }).then((response) => {
        console.log(response.status)
        console.log(response.statusText)
        return callback({message: response.statusText, statusCode: response.status})
    }, (error) => {
        console.error("ERROR: " + error)
        return callback({error, statusCode: 400})
    })

    

}

module.exports = {teams_call}