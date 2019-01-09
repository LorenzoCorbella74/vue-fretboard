<template>
  <div>
    <div class="home">
      <div class="container">
        <div class="row">
          <div class="page-header">
            <h1>{{title}}</h1>
          </div>
          <hr>
          <div class="d-flex flex-row-reverse">
            <div class="p-2">
              <b-button :size="'sm'" :variant="'success'" @click="addItem">Aggiungi</b-button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card mr-2" style="width: 17rem;" v-for="card in items" :key="card.id">
            <img class="card-img-top" src="https://via.placeholder.com/120x80" alt="Card image">
            <div class="card-body">
              <h5 class="card-title">{{card.title}} - {{card.id}}</h5>
              <p class="card-text">{{card.description}}</p>
              <a href="#" class="card-link" @click="editItem(card.id)">Edit</a>
              <a href="#" class="card-link" @click="deleteItem(card.id)">Delete</a>
              <a href="#" class="card-link" @click="checkItem(card.id)">Check</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="myModalRef" :title="editmode? 'Edita elemento':'Salva elemento'" @ok="onSubmit">
      <b-form>
        <b-form-group id="exampleInputGroup1" label="Titolo" label-for="formTitle">
          <b-form-input
            id="formTitle"
            type="text"
            v-model="form.title"
            required
            placeholder="Inserire un titolo"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup2" label="Descrizione" label-for="exampleInput2">
          <b-form-textarea
            id="exampleInput2"
            type="text"
            v-model="form.description"
            required
            placeholder="Inserire una descrizione dello studio"
            :max-rows="6"
          ></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'home',
  data: function() {
    return {
      title: 'Benvenuti',
      editmode: false,
      form: {
        title: '',
        description: ''
      },
      items: [
        // esempio di struttura
        // {
        //   id: 0,
        //   title: 'Esempio 1',
        //   description:
        //     'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum ratione consequuntur hic est recusandae! Dolorum, voluptates.',
        //   data: ['c lydian']
        // }
      ]
    };
  },
  methods: {
    addItem(formData) {
      this.$refs.myModalRef.show();
    },
    editItem(itemId) {
      this.$refs.myModalRef.show();
      let theOne = this.items.find(e => e.id == itemId);
      this.form.title = theOne.title;
      this.form.description = theOne.description;
      this.editmode = true;
      this.editedItem = theOne.id;
    },
    checkItem(itemId) {
      // TODO:
    },
    deleteItem(itemId) {
      this.items = this.items.filter(e => e.id != itemId);
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.title && this.form.description) {
        if (this.editmode) {
          var newItem = {
            id: this.editedItem,
            title: this.form.title,
            description: this.form.description,
            data: []
          };
          this.$set(this.items, this.editedItem, newItem);
          this.editmode = false;
        } else {
          var nextIndex = this.items.length;
          var newItem = {
            id: nextIndex,
            title: this.form.title,
            description: this.form.description,
            data: []
          };
          this.$set(this.items, nextIndex, newItem);
        }
        console.log(this.$data.items);
        this.$refs.myModalRef.hide();
        this.resetForm();
      } else {
        evt.preventDefault();
      }
    },
    resetForm() {
      this.form.title = '';
      this.form.description = '';
    }
  }
};
</script>
