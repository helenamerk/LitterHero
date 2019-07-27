import constants from './config/constants';
import Storage from './lib/Storage';
import serviceMap from './config/serviceMap';

export const submitTicket = async (image_uri, location, selected) => {
  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  let uriParts = image_uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  formData.append('photo', {
    uri: image_uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  //loc = await getCurrentLocation();
  formData.append('lat', String(location['latitude']));
  formData.append('long', String(location['longitude']));

  // items stored on device
  //phone = await Storage.getItem('phone');
  //name = await Storage.getItem('name');
  user_id = await Storage.getItem('user_id');

  //formData.append('phone', phone);
  //formData.append('name', name);
  formData.append('user_id', user_id);

  // hardcoded for now
  formData.append('service_code', serviceMap[selected]['service_code']);
  formData.append('service_name', serviceMap[selected]['service_name']);
  formData.append('description', serviceMap[selected]['description']);

  const url = constants.SERVERNAME + '/tickets';
  // perform fetch request
  return fetch(url, {
    method: 'POST',
    body: formData,
    header: {
      'content-type': 'multipart/form-data',
    },
  });
  // .then((res) => {
  //   console.log(res.json());
  //   return res;
  // })
  // .catch((err) => {
  //   console.log(err);

  //   return err;
  //   //throw err; // Swallow for now
  // });
  //const fin = await res.json();
};

export const getTickets = async (user_id) => {
  let slug = '';
  if (user_id) {
    slug = '?user_id' + user_id;
  }
  const url = constants.SERVERNAME + '/tickets' + slug;
  let tickets = await fetch(url);
  tickets = await tickets.json();
  console.log(tickets);
  return tickets;
};

export const loginUser = async (username, number) => {
  const url = constants.SERVERNAME + '/users';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        username: username,
        number: number,
      },
    }),
  });

  const fin = await res.json();
  return fin;
};

export const getFormattedTimestamp = () => {
  let date = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  let hours = new Date().getHours();
  let min = new Date().getMinutes();
  let sec = new Date().getSeconds();
  return month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec;
};
