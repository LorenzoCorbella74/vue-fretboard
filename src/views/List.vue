<template>
  <div>
    <div class="home">
      <div class="container bg-white">
        <div class="p-2 page-header">
          <h1>{{title}}</h1>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-3">
            <b-form-group :label="$t('List.radio_filter')">
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
            <b-form-input type="text" v-model="textFilter" :placeholder="$t('List.input_filter')"></b-form-input>
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
                <span class="badge-position" v-if="card.data.length>0">{{card.data.length}}</span>
                <h4 class="card-title text-light">{{card.title}}</h4>
                <h6 class="card-subtitle mb-2 text-light sub-title">{{card.date | date_format}}</h6>
              </div>
            </div>
            <div class="card" :class="[card.progress==100? 'bg-warning':'']">
              <div class="card-body">
                <p class="card-text custom-height">{{card.description | text_truncate(60)}}</p>
                <b-progress :value="card.progress" :max="max" show-value class="mb-3"></b-progress>
                <div class="d-flex justify-content-around">
                  <div class="p-1">
                    <button
                      type="button"
                      class="btn btn-link"
                      v-b-tooltip.hover
                      :title="$t('List.btn_edit')"
                      @click="editItem(card.id)"
                    >
                      <font-awesome-icon icon="edit"/>
                    </button>
                  </div>
                  <div class="p-1">
                    <button
                      type="button"
                      class="btn btn-link"
                      v-b-tooltip.hover
                      :title="$t('List.btn_trash')"
                      @click="deleteItem(card.id)"
                    >
                      <font-awesome-icon icon="trash"/>
                    </button>
                  </div>
                  <div class="p-1">
                    <button
                      type="button"
                      class="btn btn-link"
                      v-b-tooltip.hover
                      :title="$t('List.btn_add')"
                      @click="checkItem(card.id)"
                    >
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
    <b-modal
      ref="myModalRef"
      :title="editmode? $t('List.modal_edit_title'):$t('List.modal_save_title')"
    >
      <form>
        <b-form-group
          id="exampleInputGroup1"
          :label="$t('List.form_label_title')"
          label-for="formTitle"
        >
          <b-form-input
            id="formTitle"
            type="text"
            name="titolo"
            v-model="form.title"
            :placeholder="$t('List.form_placeholder_title')"
            v-validate="'required'"
            :class="{'is-invalid': submitted && errors.has('titolo') }"
          ></b-form-input>
          <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          id="exampleInputGroup2"
          :label="$t('List.form_label_description')"
          label-for="exampleInput2"
        >
          <b-form-textarea
            id="exampleInput2"
            type="text"
            name="description"
            v-model="form.description"
            :placeholder="$t('List.form_placeholder_description')"
            :rows="3"
            :max-rows="6"
            v-validate="'required'"
            :class="{'is-invalid': submitted && errors.has('description') }"
          ></b-form-textarea>
          <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="exampleInputGroup3"
          :label="$t('List.form_label_progress')"
          label-for="exampleInput3"
        >
          <b-form-input
            id="exampleInput3"
            type="range"
            v-model.number="form.progress"
            placeholder="Indicare"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="exampleInputGroup4"
          :label="$t('List.form_label_tipo')"
          label-for="exampleInput4"
        >
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
        <b-btn
          size="md"
          class="float-right"
          variant="primary"
          type="submit"
          @click="onSubmit"
        >{{$t('List.btn_save')}}</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue';

export const lista = []; /* oggetto condiviso tra le pagine */

// Form Validation
import VeeValidate, { Validator } from 'vee-validate';
import firebase from '../assets/js/Firebase';
import { currentUser, requiresAuth } from '../router'; // FIXME: qua si recupera dal router come oggetto condiviso...
var unsubscribe;

export default {
  name: 'home',
  data: function() {
    return {
      title: '',
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
      items: lista,
      ref: firebase.firestore().collection('studies'),
      currentUser: currentUser
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
    this.title = this.$t('List.title');
    console.log('User in List: ', this.currentUser);
    this.ref
      .where('userId', '==', this.currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let i = this.items.findIndex(x => x.id == doc.id && doc.data().userId === this.currentUser.uid);
          console.log('ID trovato: ', i);
          // Se non trova elementi con lo stesso id e dello stesso autore l'aggiunge
          if (i == -1 && doc.data().userId === this.currentUser.uid) {
            this.items.push({
              id: doc.id,
              userId: doc.data().userId,
              title: doc.data().title,
              description: doc.data().description,
              progress: doc.data().progress,
              tipo: doc.data().tipo,
              data: doc.data().data,
              date: doc.data().date
            });
            console.log('ID: ', doc.id);
          }
        });
        unsubscribe = this.ref.onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const Item = { ...change.doc.data(), id: change.doc.id };
              console.log('Item was added: ', Item);
            }
            if (change.type === 'modified') {
              const updatedNote = this.items.find(item => item.id === change.doc.id);
              console.log('item was updated: ', updatedNote);
            }
            if (change.type === 'removed') {
              const deletedNote = this.items.find(item => item.id === change.doc.id);
              console.log('Item was removed: ', deletedNote);
            }
          });
        });
      });

    /* eslint-enable no-console */
  },
  destroyed() {
    unsubscribe();
  },
  mounted() {},
  methods: {
    getIconPath(id) {
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
      let i = this.items.findIndex(x => x.id == itemId);
      this.ref
        .doc(itemId)
        .delete()
        .then(() => {
          this.items.splice(i, 1);
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
              userId: this.currentUser.uid,
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
                let theIndex = this.items.findIndex(x => x.id == this.editedItem.id);
                this.$set(this.items, theIndex, newItem);
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
              userId: this.currentUser.uid,
              description: this.form.description,
              tipo: this.form.tipo,
              progress: Number(this.form.progress),
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
  border-bottom: 5px solid orange;
}
.armonica {
  border-bottom: 5px solid steelblue;
}
.pentatonica {
  border-bottom: 5px solid yellow;
}
.diminuita {
  border-bottom: 5px solid green;
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
.badge-position {
  position: absolute;
  background-color: transparent;
  border-radius: 5px;
  border: 1px dotted #f0ad4e;
  padding: 1px 5px;
  right: 5px;
  top: 5px;
  color: #f0ad4e;
}
</style>


