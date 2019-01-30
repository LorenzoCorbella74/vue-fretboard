<template>
  <div>
    <div class="home">
      <div class="container bg-light mb-1" :class="{'sticky-top navbar-sticky':fixBtnBar}">
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 page-header">
            <h1>{{this.$t('List.title')}}</h1>
          </div>
          <div class="p-2">
            <b-button size="m" variant="outline-warning" @click="addItem" class="px-5">
              <font-awesome-icon icon="plus"/>
            </b-button>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 flex-fill">
            <b-form-group :label="$t('List.radio_filter')">
              <b-form-radio-group id="radios2" v-model="listFilter" name="radioSubComponent">
                <b-form-radio value="data">Data
                  <font-awesome-icon icon="clock"/>
                </b-form-radio>
                <b-form-radio value="progress">Progress
                  <font-awesome-icon icon="sort-numeric-up"/>
                </b-form-radio>
                <!--  <b-form-radio value="tag">Famiglia
                  <font-awesome-icon icon="layer-group"/>
                </b-form-radio>-->
              </b-form-radio-group>
            </b-form-group>
          </div>
          <div class="p-2 flex-fill">
            <b-form-input
              type="text"
              v-model="textFilter"
              :placeholder="$t('List.input_filter')"
              class="only-this-input"
            ></b-form-input>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row" v-if="items.length>0">
          <div class="col-lg-3 col-sm-6 my-2" v-for="card in filteredList" :key="card.id">
            <div class="card border-dark pointer" :class="[card.tag]" @click="checkItem(card.id)">
              <img class="card-img-top" :src="getIconPath(card.imageNum)" alt="Card image">
              <div class="card-img-overlay">
                <span class="badge-position-top" v-if="card.data.length>0">{{card.data.length}}</span>
                <h5 class="card-title text-light">{{card.title}}</h5>
                <h6 class="card-subtitle mb-2 text-light sub-title">{{card.date | date_format}}</h6>
                <span
                  class="badge badge-pill badge-warning"
                  v-for="(tag,index) in card.tags"
                  :key="index"
                  style="color:black; margin-right:3px;font-size:10px"
                >{{tag.text}}</span>
                <!-- :style="'left:'+25*(index+1)+'px'" -->
              </div>
            </div>
            <div class="card" :class="[card.progress==100? 'bg-warning':'']">
              <div class="card-body" style="padding: 10px 16px 2px 16px;">
                <p class="card-text custom-height">{{card.description | text_truncate(56)}}</p>
                <b-progress :value="card.progress" :max="max" show-value></b-progress>
                <div class="d-flex justify-content-around">
                  <div>
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
                  <div>
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
            type="number"
            v-model.number="form.progress"
            placeholder="Indicare"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="exampleInputGroup4"
          :label="$t('List.form_label_tipo')"
          label-for="exampleInput4"
        >
          <vue-tags-input
            id="exampleInput4"
            v-model="form.tag"
            :tags="form.tags"
            :allow-edit-tags="true"
            :autocomplete-items="filteredItems"
            @tags-changed="newTags => form.tags = newTags"
          />
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
/* import Vue from 'vue'; */

export const lista = []; /* oggetto condiviso tra le pagine */

// Form Validation
import VeeValidate, { Validator } from 'vee-validate';
import firebase from '../assets/js/Firebase';
import VueTagsInput from '@johmun/vue-tags-input';
import { currentUser } from '../router'; // FIXME: qua si recupera dal router come oggetto condiviso...
var unsubscribe;

export default {
  name: 'home',
  components: { VueTagsInput },
  data: function() {
    return {
      title: '',
      listFilter: 'data',
      textFilter: '',
      tagFilter: '',
      max: 100,
      editmode: false,
      form: {
        title: '',
        description: '',
        progress: 0,
        tag: '', // è il valore che viene via via riempito
        tags: []
      },
      autocompleteItems: [
        { text: 'Maggiore' },
        { text: 'Minore' },
        { text: 'Melodica' },
        { text: 'Armonica' },
        { text: 'Pentatonica' },
        { text: 'Diminuita' },
        { text: 'Toni interi' }
      ],
      submitted: false,
      items: lista,
      ref: firebase.firestore().collection('studies'),
      currentUser: currentUser,
      fixBtnBar: false
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);

    // console.log('User in List: ', this.currentUser);
    this.ref
      .where('userId', '==', this.currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let i = this.items.findIndex(x => x.id == doc.id && doc.data().userId === this.currentUser.uid);
          // console.log('ID trovato: ', i);
          // Se non trova elementi con lo stesso id e dello stesso autore l'aggiunge
          if (i == -1 && doc.data().userId === this.currentUser.uid) {
            this.items.push({
              id: doc.id,
              imageNum: doc.data().imageNum,
              userId: doc.data().userId,
              title: doc.data().title,
              description: doc.data().description,
              progress: doc.data().progress,
              tags: doc.data().tags,
              data: doc.data().data,
              date: doc.data().date
            });
            // console.log('ID: ', doc.id);
          }
        });
        unsubscribe = this.ref.onSnapshot(snapshot => {
          /* snapshot.docChanges().forEach(change => {
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
          }); */
        });
      });

    /* eslint-enable no-console */
  },
  destroyed() {
    unsubscribe();
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted() {},
  methods: {
    handleScroll() {
      if (document.body.scrollTop > 32 || document.documentElement.scrollTop > 32) {
        this.fixBtnBar = true;
      } else {
        this.fixBtnBar = false;
      }
    },
    getIconPath(num) {
      let imgNum = Number(num) + 1;
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
      this.form.tags = theOne.tags;
      this.form.data = theOne.data;
      this.form.date = theOne.date;
      this.editmode = true;
      this.editedItem = theOne;
      // console.log('Edited one: ', this.editedItem);
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
              imageNum: this.editedItem.imageNum,
              userId: this.currentUser.uid,
              title: this.form.title,
              description: this.form.description,
              tags: this.form.tags,
              progress: Number(this.form.progress),
              data: this.editedItem.data || [],
              date: this.editedItem.date || new Date().toISOString()
            };
            console.log('Updated Item: ', newItem);
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
            let nextIndex = this.items.length; // si simula un id di partenza
            var newItem = {
              imageNum: nextIndex,
              title: this.form.title,
              userId: this.currentUser.uid,
              description: this.form.description,
              tags: this.form.tags,
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
      this.form.tags = [];
      this.submitted = false;
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.form.tag.toLowerCase()) !== -1;
      });
    },
    filteredList() {
      if (this.items.length > 0) {
        const filteredByText = this.items.filter(e => {
          return e.description.toLowerCase().includes(this.textFilter.toLowerCase());
        });
        /* console.log(filteredByText.length);
        const filteredByTag = filteredByText.filter(e => {
          if (e.tags && e.tags.length > 0) {
            return e.tags.some(a => a.text.toLowerCase().includes(this.tagFilter.toLowerCase()));
          } else {
            return true;
          }
        }); */
        if (this.listFilter == 'data') {
          // Ascending: dal numero minore al maggiore
          return filteredByText.sort((obj1, obj2) => obj1.id - obj2.id);
        } else if (this.listFilter == 'progress') {
          // discendente: dal numero maggiore al minore
          return filteredByText.sort((obj1, obj2) => obj2.progress - obj1.progress);
        } /* else if (this.listFilter == 'tag') {
          return filtered.sort((a, b) => {
            // Use toUpperCase() to ignore character casing
            const tipoA = a.tag.toUpperCase();
            const tipoB = b.tag.toUpperCase();
            let comparison = 0;
            if (tipoA > tipoB) {
              comparison = 1;
            } else if (tipoA < tipoB) {
              comparison = -1;
            }
            return comparison;
          });
        } */
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="css" scoped>
.navbar-sticky {
  top: 105px;
  z-index: 500;
  width: inherit;
  height: inherit;
  border-bottom: 1px grey solid;
}

.pointer {
  cursor: pointer;
}
/* style the background and the text color of the input ... */
.vue-tags-input {
  background: #f7f7f9;
  max-width: 480px;
  color: #fff;
}

.sub-title {
  font-size: 12px;
}
.custom-height {
  height: 58px;
}
.badge-position-top {
  position: absolute;
  background-color: transparent;
  border-radius: 5px;
  border: 1px dotted #f0ad4e;
  padding: 1px 5px;
  right: 5px;
  top: 5px;
  color: #f0ad4e;
}
.only-this-input {
  background-color: white !important;
}
</style>

