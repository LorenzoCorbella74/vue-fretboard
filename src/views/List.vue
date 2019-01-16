<template>
  <div>
    <div class="home">
      <div class="container">
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 page-header">
            <h1>{{title}}</h1>
          </div>
          <div class="p-2">
            <b-button size="m" :variant="'outline-primary'" @click="addItem" class="px-5">
              <font-awesome-icon icon="plus"/>
            </b-button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 col-sm-6 mb-2" v-for="card in items" :key="card.id">
            <!-- mr-1 d-inline-block -->
            <div class="card">
              <img class="card-img-top" :src="getIconPath(card.id)" alt="Card image">
              <div class="card-img-overlay">
                <h3 class="card-title">{{card.title}}</h3>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <p class="card-text">{{card.description| text_truncate(60)}}</p>
                <b-progress :value="card.progress" :max="max" show-value class="mb-3"></b-progress>
                <!-- 
                <b-btn v-b-toggle.collapse1 link variant="outline-primary">
                <font-awesome-icon icon="angle-down"/>
              </b-btn>
              <b-collapse id="collapse1" class="mt-2">
                <b-card>
                  <ul>
                    <li v-for="a in card.data">{{'- ' + a.root +' '+ a.name}}</li>
                  </ul>
                </b-card>
                </b-collapse>-->
                <div class="d-flex justify-content-around">
                  <div class="p-2">
                    <a href="#" class="card-link" @click="editItem(card.id)">
                      <font-awesome-icon icon="edit"/>
                    </a>
                  </div>
                  <div class="p-2">
                    <a href="#" class="card-link" @click="deleteItem(card.id)">
                      <font-awesome-icon icon="trash"/>
                    </a>
                  </div>
                  <div class="p-2">
                    <a href="#" class="card-link" @click="checkItem(card.id)">
                      <font-awesome-icon icon="list"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="myModalRef" :title="editmode? 'Edita studio':'Salva studio'" @ok="onSubmit">
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
            :rows="3"
            :max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group id="exampleInputGroup3" label="Progress" label-for="exampleInput3">
          <b-form-input
            id="exampleInput3"
            type="number"
            v-model="form.progress"
            placeholder="Indicare"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue';
export const lista = [];

export default {
  name: 'home',
  data: function() {
    return {
      title: 'Studi',
      max: 100,
      editmode: false,
      form: {
        title: '',
        description: '',
        progress: 0
      },
      items: lista
      // esempio di struttura
      // {
      //   id: 0,
      //   title: 'Esempio 1',
      //   description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      //   progress:0
      //   data: ['c lydian']
      // }
    };
  },
  mounted() {
    this.$ls.get('lista', 0).forEach((e, i) => {
      this.$set(this.items, i, e);
    });
  },
  methods: {
    getIconPath(id) {
      //let randomNumber = Math.floor(Math.random() * 15) + 1;
      let imgNum = Number(id) + 1;
      return require(`../assets/img/guitar${imgNum}.jpeg`);
    },
    addItem(formData) {
      this.$refs.myModalRef.show();
    },
    editItem(itemId) {
      this.$refs.myModalRef.show();
      let theOne = this.items.find(e => e.id == itemId);
      this.form.title = theOne.title;
      this.form.description = theOne.description;
      this.form.progress = theOne.progress;
      this.editmode = true;
      this.editedItem = theOne;
      console.log('Edited one: ', this.editedItem);
    },
    checkItem(itemId) {
      this.$router.push(`/item/${itemId}`);
    },
    deleteItem(itemId) {
      this.items = this.items.filter(e => e.id != itemId);
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.title && this.form.description) {
        if (this.editmode) {
          var newItem = {
            id: this.editedItem.id,
            title: this.form.title,
            description: this.form.description,
            progress: Number(this.form.progress),
            data: this.editItem.data || []
          };
          this.$set(this.items, this.editedItem.id, newItem);
          this.$ls.set('lista', this.items);
          this.editmode = false;
        } else {
          var nextIndex = this.items.length;
          var newItem = {
            id: nextIndex,
            title: this.form.title,
            description: this.form.description,
            progress: Number(this.form.progress),
            progress: this.form.progress,
            data: []
          };
          this.$set(this.items, nextIndex, newItem);
          this.$ls.set('lista', this.items);
        }
        // console.log(this.$data.items);
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
  },
  computed: {}
};
</script>
