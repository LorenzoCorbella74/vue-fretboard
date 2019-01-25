<template>
  <div class="about">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <b-jumbotron header="Buon studio!" lead="La webapp che hai sempre sognato...">
            <br>
            <p>
              L'obiettivo è aiutare tutti i chitarristi a visualizzare le sovrapposizioni di scale ed arpeggi sulla tastiera
              e archiviare e gestire comodamente gli studi di tali sovrapposizioni.
            </p>
            <hr class="my-4">
            <p>Per le tecnologie usate vedere:
              <!--  <span>
                <font-awesome-icon :icon="['fab', 'vuejs' ]" size="4x"/>
              </span>-->
            </p>
            <br>
            <b-btn
              class="lead"
              variant="danger"
              href="https://github.com/LorenzoCorbella74/vue-fretboard"
            >
              <span class="p-2">
                <font-awesome-icon :icon="['fab', 'github' ]"/>
              </span>More Info
            </b-btn>
            <br>
          </b-jumbotron>
        </div>
      </div>
      <footer class="footer">
        <div class="text-center p-3">
          <p>
            Made with
            <span style="color: #e25555;">&#9829;</span> in Rome
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>


<style>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  font-weight: 800;

  color: white;
}
</style>




