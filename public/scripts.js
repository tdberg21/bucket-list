console.log('hello world')


const handleSubmit = () => {
  let title = $('.title-input').val();
  let description = $('.description-input').val();
  console.log(title, description)
  appendListItem(title, description);
  clearInputs();
};

const appendListItem = (title, description) => {
  $('.bucket-list-container').append(`
    <div class="list-item-card">
      <h3 class="item-title-headers">${title}</h3>
      <p class="item-description-paragraphs"> ${description} </p>
      <button class="delete-buttons">Delete</button>      
    </div>
  `)
};

const saveItemToDatabase = (title, description) => {
  console.log('send to database');
};

const clearInputs = () => {
  $('.title-input').val('');
  $('.description-input').val('');
};

$('.submit-button').on('click', handleSubmit);

