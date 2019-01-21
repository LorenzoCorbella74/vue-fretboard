<template>
  <div>
    <div class="home">
      <div class="container bg-white">
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 page-header">
            <h1>{{title}}</h1>
          </div>
          <div class="p-2">
            <b-form-group label="Filtra per">
              <b-form-radio-group id="radios2" v-model="listFilter" name="radioSubComponent">
                <b-form-radio value="data">Data</b-form-radio>
                <b-form-radio value="progress">Progress</b-form-radio>
                <b-form-radio value="tipo">Famiglia</b-form-radio>
                <b-form-radio value="testo" disabled>Testo</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </div>
          <div class="p-2">
            <b-button size="m" :variant="'outline-primary'" @click="addItem" class="px-5">
              <font-awesome-icon icon="plus"/>
            </b-button>
          </div>
        </div>

        <div class="row" v-if="items.length>0">
          <div class="col-lg-3 col-sm-6 mb-2" v-for="card in filteredList" :key="card.id">
            <!-- mr-1 d-inline-block -->
            <div class="card" :class="[card.tipo]" v-once @click="checkItem(card.id)">
              <img class="card-img-top" :src="getIconPath(card.id)" alt="Card image">
              <div class="card-img-overlay">
                <h3 class="card-title text-light">{{card.title}}</h3>
                <h6 class="card-subtitle mb-2 text-light sub-title">{{card.date | date_format}}</h6>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <p class="card-text">{{card.description| text_truncate(60)}}</p>
                <b-progress :value="card.progress" :max="max" show-value class="mb-3"></b-progress>
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
            v-model.number="form.progress"
            placeholder="Indicare"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup4" label="Famiglia" label-for="exampleInput4">
          <b-form-select
            id="exampleInput4"
            v-model="form.tipo"
            :options="optionsTipo"
            :select-size="4"
          />
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
      listFilter: 'data',
      max: 100,
      editmode: false,
      form: {
        title: '',
        description: '',
        progress: 0,
        tipo: null
      },
      optionsTipo: [
        { value: null, text: 'Selezionare una scala' },
        { value: 'maggiore', text: 'Maggiore' },
        { value: 'minore', text: 'Minore' },
        { value: 'melodica', text: 'Minore Melodica' },
        { value: 'armonica', text: 'Minore Armonica' },
        { value: 'pentatonica', text: 'Pentatonica' },
        { value: 'diminuita', text: 'Diminuita' },
        { value: 'interi', text: 'A toni interi', disabled: true }
      ],
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
    const l = this.$ls.get('lista', 0);
    if (l) {
      this.$ls.get('lista', 0).forEach((e, i) => {
        if (e) {
          this.$set(this.items, i, e);
        }
      });
      console.log('Items: ', this.$data.items);
    }
  },
  methods: {
    getIconPath(id) {
      // let randomNumber = Math.floor(Math.random() * 14) + 1;
      let imgNum = Number(id) + 1;
      if (imgNum > 14) {
        imgNum = imgNum % 14;
      }
      return require(`../assets/img/guitar${imgNum}.jpeg`);
    },
    addItem(formData) {
      this.resetForm();
      this.$refs.myModalRef.show();
    },
    editItem(itemId) {
      this.$refs.myModalRef.show();
      let theOne = this.items.find(e => e.id == itemId);
      this.form.title = theOne.title;
      this.form.description = theOne.description;
      this.form.progress = theOne.progress;
      this.form.tipo = theOne.tipo;
      this.editmode = true;
      this.editedItem = theOne;
      console.log('Edited one: ', this.editedItem);
    },
    checkItem(itemId) {
      this.$router.push(`/item/${itemId}`);
    },
    deleteItem(itemId) {
      this.items = this.items.filter(e => e.id != itemId);
      this.$ls.set('lista', this.$data.items);
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.title && this.form.description) {
        if (this.editmode) {
          var newItem = {
            id: this.editedItem.id,
            title: this.form.title,
            description: this.form.description,
            tipo: this.form.tipo,
            progress: Number(this.form.progress),
            data: this.editedItem.data || [],
            date: this.editedItem.date
          };
          this.$set(this.items, this.editedItem.id, newItem);
          this.$ls.set('lista', this.$data.items);
          this.editmode = false;
        } else {
          var nextIndex = this.items.length; // si simula un id di partenza
          var newItem = {
            id: nextIndex,
            title: this.form.title,
            description: this.form.description,
            tipo: this.form.tipo,
            progress: Number(this.form.progress),
            progress: this.form.progress,
            date: new Date().toISOString(),
            data: []
          };
          this.$set(this.items, nextIndex, newItem);
          this.$ls.set('lista', this.$data.items);
        }

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
  computed: {
    filteredList() {
      if (this.items.length > 0) {
        if (this.listFilter == 'data') {
          // Ascending: dal numero minore al maggiore
          return this.items.sort((obj1, obj2) => obj1.id - obj2.id);
        } else if (this.listFilter == 'progress') {
          // discendente: dal numero maggiore al minore
          return this.items.sort((obj1, obj2) => obj2.progress - obj1.progress);
        } else if (this.listFilter == 'tipo') {
          return this.items.sort((a, b) => {
            // Use toUpperCase() to ignore character casing
            const tipoA = a.tipo.toUpperCase();
            const tipoB = b.tipo.toUpperCase();
            let comparison = 0;
            if (tipoA > tipoB) {
              comparison = 1;
            } else if (tipoA < tipoB) {
              comparison = -1;
            }
            return comparison;
          });
        }
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.maggiore {
  border-bottom: 5px solid red;
}
.minore {
  border-bottom: 5px solid aqua;
}
.melodica {
  border-bottom: 5px solid aquamarine;
}
.armonica {
  border-bottom: 5px solid steelblue;
}
.pentatonica {
  border-bottom: 5px solid yellow;
}
.diminuita {
  border-bottom: 5px solid coral;
}
.interi {
  border-bottom: 5px solid goldenrod;
}
.sub-title {
  font-size: 12px;
}
</style>


