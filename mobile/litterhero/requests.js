import constants from './config/constants';
import Storage from './lib/Storage';
import serviceMap from './config/serviceMap';

export const submitTicket = async (
  image_uri,
  location,
  selected
) => {
  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  let uriParts = image_uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  // formData.append('photo', {
  //   image_uri,
  //   name: `photo.${fileType}`,
  //   type: `image/${fileType}`,
  // });
  formData.append('image_url', 'www.google.com');

  //loc = await getCurrentLocation();
  formData.append('lat', String(location['latitude']));
  formData.append('long', String(location['longitude']));

  // items stored on device
  email = await Storage.getItem('email');
  name = await Storage.getItem('name');

  formData.append('email', email);
  formData.append('name', name);

  // hardcoded for now
  // TOOD: add selector for user
  formData.append('service_code', serviceMap[selected]['service_code']);
  formData.append('comment', serviceMap[selected]['description']);

  console.log(formData);
  console.log(email);
  console.log(name);
  console.log('POST ALL THIS CONTENT TO BACKEND');
  // perform fetch request
  return await fetch(constants.SERVERNAME, {
    method: 'POST',
    body: formData,
    header: {
      'content-type': 'multipart/form-data',
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      //throw err; // Swallow for now
    });
};

export const getTickets = async () => {
  const url = constants.SERVERNAME + '/tickets';
  return await fetch(url)
  /*
  return [
    {
      id: '123',
      type: 'Human Feces',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      description: 'User entered text',
      location: '5th & Market',
      upvotes: 5,
    },
    {
      id: '132',
      type: 'Pothole',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      description: 'User entered text',
      location: '1088 11th St.',
      upvotes: 1,
    },
    {
      id: '133',
      type: 'poop',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      description: 'User entered text',
      location: '5th & Market, SF',
      upvotes: 1,
    },
  ];*/
};

export const loginUser = (username, number) => {
  const url = constants.SERVERNAME + '/users';

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        username: username,
        number: number,
      }
   })
  })
    .then((res) => {
      console.log(res);
      console.log('---------------------here')
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
      //throw err; // Swallow for now
    });
}

/*
long:
lat:
request_type: string
service_code: int

// store on device, send with every request
email:
first:
*/

export const getFormattedTimestamp = () => {
  let date = new Date().getDate(); //Current Date
  let month = new Date().getMonth() + 1; //Current Month
  let year = new Date().getFullYear(); //Current Year
  let hours = new Date().getHours(); //Current Hours
  let min = new Date().getMinutes(); //Current Minutes
  let sec = new Date().getSeconds(); //Current Seconds
  return date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
};
