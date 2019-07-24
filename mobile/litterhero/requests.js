import constants from './config/constants';
import Storage from './lib/Storage';

export const submitTicket = async (uri, location) => {
  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });
  formData.append('latitude', String(loc.latitude));
  formData.append('longitude', String(loc.longitude));

  // items stored on device
  email = await Storage.getItem('email');
  first_name = await Storage.getItem('first_name');

  formData.append('email', email);
  formData.append('first_name', first_name);

  // perform fetch request
  return await fetch(constants.SERVERNAME, {
    method: 'POST',
    body: formData,
    header: {
      'content-type': 'multipart/form-data',
    },
  });
};

/*
long:
lat:
request_type: string
service_code: int

// store on device, send with every request
email:
first:
*/
