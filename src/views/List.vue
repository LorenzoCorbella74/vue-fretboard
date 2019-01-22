<template>
  <div>
    <div class="home">
      <div class="container bg-white">
        <div class="p-2 page-header">
          <h1>{{title}}</h1>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-3">
            <b-form-group label="Filtra:">
              <b-form-radio-group id="radios2" v-model="listFilter" name="radioSubComponent">
                <b-form-radio value="data">
                  <font-awesome-icon icon="clock"/>
                </b-form-radio>
                <b-form-radio value="progress">
                  <font-awesome-icon icon="sort-numeric-up"/>
                </b-form-radio>
                <b-form-radio value="tipo">
                  <font-awesome-icon icon="layer-group"/>
                </b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </div>
          <div class="p-3">
            <b-form-input type="text" v-model="textFilter" placeholder="cerca testo..."></b-form-input>
          </div>
          <div class="p-3">
            <b-button size="m" :variant="'outline-primary'" @click="addItem" class="px-5">
              <font-awesome-icon icon="plus"/>
            </b-button>
          </div>
        </div>

        <div class="row" v-if="items.length>0">
          <div class="col-lg-3 col-sm-6 mb-3" v-for="(card,index) in filteredList" :key="card.id">
            <div class="card" :class="[card.tipo]" @click="checkItem(card.id)">
              <img class="card-img-top" :src="getIconPath(index+1)" alt="Card image">
              <div class="card-img-overlay">
                <h4 class="card-title text-light">{{card.title}}</h4>
                <h6 class="card-subtitle mb-2 text-light sub-title">{{card.date | date_format}}</h6>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <p class="card-text custom-height">{{card.description | text_truncate(60)}}</p>
                <b-progress :value="card.progress" :max="max" show-value class="mb-3"></b-progress>
                <div class="d-flex justify-content-around">
                  <div class="p-1">
                    <button type="button" class="btn btn-link" @click="editItem(card.id)">
                      <font-awesome-icon icon="edit"/>
                    </button>
                  </div>
                  <div class="p-1">
                    <button type="button" class="btn btn-link" @click="deleteItem(card.id)">
                      <font-awesome-icon icon="trash"/>
                    </button>
                  </div>
                  <div class="p-1">
                    <button type="button" class="btn btn-link" @click="checkItem(card.id)">
                      <font-awesome-icon icon="list"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MODALE SALVA EDITA Studio-->
    <b-modal ref="myModalRef" :title="editmode? 'Edita studio':'Salva studio'">
      <form>
        <b-form-group id="exampleInputGroup1" label="Titolo" label-for="formTitle">
          <b-form-input
            id="formTitle"
            type="text"
            name="titolo"
            v-model="form.title"
            placeholder="Inserire un titolo"
            v-validate="'required'"
            :class="{'is-invalid': submitted && errors.has('titolo') }"
          ></b-form-input>
          <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="exampleInputGroup2" label="Descrizione" label-for="exampleInput2">
          <b-form-textarea
            id="exampleInput2"
            type="text"
            name="description"
            v-model="form.description"
            placeholder="Inserire una descrizione dello studio"
            :rows="3"
            :max-rows="6"
            v-validate="'required'"
            :class="{'is-invalid': submitted && errors.has('description') }"
          ></b-form-textarea>
          <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="exampleInputGroup3" label="Completamento" label-for="exampleInput3">
          <b-form-input
            id="exampleInput3"
            type="range"
            v-model.number="form.progress"
            placeholder="Indicare"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup4" label="Famiglia" label-for="exampleInput4">
          <b-form-select
            id="exampleInput4"
            name="tipo"
            v-model="form.tipo"
            :options="optionsTipo"
            :select-size="4"
            v-validate="'required'"
            :class="{'is-invalid': submitted && errors.has('description') }"
          />
          <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
        </b-form-group>
      </form>
      <div slot="modal-footer" class="w-100">
        <b-btn size="md" class="float-right" variant="primary" type="submit" @click="onSubmit">Salva</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue';
// export const lista = [];

// Form Validation
import VeeValidate, { Validator } from 'vee-validate';
import firebase from '../assets/js/Firebase';

export default {
  name: 'home',
  data: function() {
    return {
      title: 'Studi',
      listFilter: 'data',
      textFilter: '',
      max: 100,
      editmode: false,
      form: {
        title: '',
        description: '',
        progress: 0,
        tipo: null
      },
      submitted: false,
      optionsTipo: [
        { value: null, text: 'Selezionare una scala' },
        { value: 'maggiore', text: 'Maggiore' },
        { value: 'minore', text: 'Minore' },
        { value: 'melodica', text: 'Min. Melodica' },
        { value: 'armonica', text: 'Min. Armonica' },
        { value: 'pentatonica', text: 'Pentatonica' },
        { value: 'diminuita', text: 'Diminuita' },
        { value: 'interi', text: 'A toni interi' }
      ],
      items: [],
      ref: firebase.firestore().collection('studies')
      // esempio di struttura
      // {
      //   id: 0,
      //   title: 'Esempio 1',
      //   description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      //   progress:0
      //   data: []
      // }
    };
  },
  created() {
    this.ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.items.push({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          progress: doc.data().progress,
          tipo: doc.data().tipo,
          data: doc.data().data,
          date: doc.data().date
        });
      });
      console.log('Items from Firebase: ', this.items);
    });
  },
  mounted() {},
  methods: {
    getIconPath(id) {
      // let randomNumber = Math.floor(Math.random() * 14) + 1;
      let imgNum = Number(id) + 1;
      if (imgNum > 20) {
        imgNum = imgNum % 20;
      }
      return require(`../assets/img/guitar${imgNum}.jpeg`);
    },
    addItem() {
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
      this.form.data = theOne.data;
      this.form.date = theOne.date;
      this.editmode = true;
      this.editedItem = theOne;
      console.log('Edited one: ', this.editedItem);
    },
    checkItem(itemId) {
      this.$router.push(`/item/${itemId}`);
    },
    deleteItem(itemId) {
      this.ref
        .doc(itemId)
        .delete()
        .then(() => {
          this.items = this.items.filter(e => e.id != itemId);
        })
        .catch(error => {
          alert('Error removing document: ', error);
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          if (this.editmode) {
            var newItem = {
              id: this.editedItem.id,
              title: this.form.title,
              description: this.form.description,
              tipo: this.form.tipo,
              progress: Number(this.form.progress),
              data: this.editedItem.data || [],
              date: this.editedItem.date || new Date().toISOString()
            };
            this.ref
              .doc(this.editedItem.id)
              .update(newItem)
              .then(docRef => {
                // aggiorna il modello FE
                // NOTE: trovare l'id!!!
                this.$set(this.items, this.editedItem.id, newItem);
              })
              .catch(error => {
                alert('Error editing study: ', error);
              });
            this.editmode = false;
            this.submitted = false;
          } else {
            var nextIndex = this.items.length; // si simula un id di partenza
            var newItem = {
              title: this.form.title,
              description: this.form.description,
              tipo: this.form.tipo,
              progress: Number(this.form.progress),
              progress: this.form.progress,
              date: new Date().toISOString(),
              data: []
            };
            this.ref
              .add(newItem)
              .then(docRef => {
                this.submitted = false;
                newItem.id = docRef.id;
                this.$set(this.items, nextIndex, newItem);
              })
              .catch(error => {
                alert('Error adding study: ', error);
              });
          }
          // si chiude la modale
          this.$refs.myModalRef.hide();
          this.resetForm();
        }
      });
    },
    resetForm() {
      this.form.title = '';
      this.form.description = '';
      this.form.progress = 0;
      this.form.tipo = null;
    }
  },
  computed: {
    filteredList() {
      if (this.items.length > 0) {
        const filtered = this.items.filter(e => {
          return e.description.toLowerCase().includes(this.textFilter.toLowerCase());
        });
        if (this.listFilter == 'data') {
          // Ascending: dal numero minore al maggiore
          return filtered.sort((obj1, obj2) => obj1.id - obj2.id);
        } else if (this.listFilter == 'progress') {
          // discendente: dal numero maggiore al minore
          return filtered.sort((obj1, obj2) => obj2.progress - obj1.progress);
        } else if (this.listFilter == 'tipo') {
          return filtered.sort((a, b) => {
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
        return null;
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
.custom-height {
  height: 64px;
}
</style>


