
const fetchBucketList = async () => {
  const response = await fetch('/api/v1/bucketlist');
  const results = await response.json();
  return results;
}

const handlePageLoad = async () => {
  const results = await fetchBucketList();
  results.forEach(item => appendListItem(item.title, item.description, item.id))
}

const handleSubmit = async () => {
  let title = $('.title-input').val();
  let description = $('.description-input').val();
  const results = await saveItemToDatabase(title, description);
  appendListItem(title, description, results.id);
  clearInputs();
};

// const handleDelete = () => {
//   console.log('delete')
// }

const appendListItem = (title, description, id) => {
  $('.bucket-list-container').append(`
    <div class="list-item-card">
      <h3 class="item-title-headers">${title}</h3>
      <p class="item-description-paragraphs"> ${description} </p>
      <button class="delete-buttons ${id}">Delete</button>      
    </div>
  `)
};

const saveItemToDatabase = async (title, description) => {
  const reponse = await fetch('/api/v1/bucketlist', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const results = await response.json();
  return results;
};

const clearInputs = () => {
  $('.title-input').val('');
  $('.description-input').val('');
};


handlePageLoad();
$('.submit-button').on('click', handleSubmit);
// $('article').on('click', '.list-item-card .delete-buttons', handleDelete);

