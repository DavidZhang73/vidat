const OBJECT_TABLE_TEMPLATE = `
<q-table
  dense
  flat
  :data="objectAnnotationList"
  row-key="x"
  :columns="columnList"
  :pagination.sync="pagination"
>
  <template v-slot:top="props">
    <div class="col-6 q-table__title">Objects</div>
    <q-space></q-space>
    <q-btn icon="clear_all" @click="handleClearAll" label="clear"></q-btn>
  </template>
  <template v-slot:body="props">
    <q-tr :props="props">
      <q-td key="x" :props="props">
        {{ toFixed2(props.row.x) }}
        <q-popup-edit
          auto-save
          v-model.number="props.row.x"
          title="Edit the x"
        >
          <q-input
            v-model.number="props.row.x"
            dense
            type="number"
          ></q-input>
        </q-popup-edit>
      </q-td>
      <q-td key="y" :props="props">
        {{ toFixed2(props.row.y) }}
        <q-popup-edit
          auto-save
          v-model.number="props.row.y"
          title="Edit the y"
        >
          <q-input
            v-model.number="props.row.y"
            dense
            type="number"
          ></q-input>
        </q-popup-edit>
      </q-td>
      <q-td key="width" :props="props">
        {{ toFixed2(props.row.width) }}
        <q-popup-edit
          auto-save
          v-model.number="props.row.width"
          title="Edit the width"
        >
          <q-input
            v-model.number="props.row.width"
            dense
            type="number"
          ></q-input>
        </q-popup-edit>
      </q-td>
      <q-td key="height" :props="props">
        {{ toFixed2(props.row.height) }}
        <q-popup-edit
          auto-save
          v-model.number="props.row.height"
          title="Edit the height"
        >
          <q-input
            v-model.number="props.row.height"
            dense
            type="number"
          ></q-input>
        </q-popup-edit>
      </q-td>
      <q-td key="label" :props="props">
        <q-select
          ref="select"
          v-model="props.row.labelId"
          :options="labelOption"
          dense
          options-dense
          borderless
          emit-value
          map-options
          @input="handleLabelInput(props.row)"
        ></q-select>
      </q-td>
      <q-td key="color" :props="props">
        <q-chip
          dense
          outline
          :style="{ 'border-color': props.row.color, 'color': props.row.color }"
        >
          {{ props.row.color.toUpperCase() }}
         </q-chip>
        <q-popup-edit
          auto-save
          v-model="props.row.color"
          title="Edit the object color"
        >
          <q-color v-model="props.row.color"></q-color>
        </q-popup-edit>
      </q-td>
      <q-td key="instance" :props="props">
        <q-input
          v-model.number="props.row.instance"
          dense
          borderless
          type="number"
        ></q-input>
      </q-td>
      <q-td key="score" :props="props">
        <q-input
          v-model.number="props.row.score"
          dense
          borderless
          type="number"
        ></q-input>
      </q-td>
      <q-td key="operation" :props="props">
        <q-btn-group spread flat>
          <q-btn
            flat
            dense
            icon="keyboard_arrow_up"
            style="width: 100%"
            @click="handleUp(props.row)"
          ></q-btn>
          <q-btn
            flat
            dense
            icon="keyboard_arrow_down"
            style="width: 100%"
            @click="handleDown(props.row)"
          ></q-btn>
          <q-btn
            flat
            dense
            icon="delete"
            color="negative"
            style="width: 100%"
            @click="handleDelete(props.row)"
          ></q-btn>
        </q-btn-group>
      </q-td>
    </q-tr>
  </template>
</q-table>
`

import utils from '../../../libs/utils.js'

const columnList = [
  {
    name: 'x',
    align: 'center',
    label: 'x',
    field: 'x',
  },
  {
    name: 'y',
    align: 'center',
    label: 'y',
    field: 'y',
  },
  {
    name: 'width',
    align: 'center',
    label: 'width',
    field: 'width',
  },
  {
    name: 'height',
    align: 'center',
    label: 'height',
    field: 'height',
  },
  {
    name: 'label',
    align: 'center',
    label: 'label',
    field: 'labelId',
  },
  {
    name: 'color',
    align: 'center',
    label: 'color',
    field: 'color',
  },
  {
    name: 'instance',
    align: 'center',
    label: 'instance',
    field: 'instance',
  },
  {
    name: 'score',
    align: 'center',
    label: 'score',
    field: 'score',
  },
  {
    name: 'operation',
    align: 'center',
    label: 'operation',
    field: 'operation',
  },
]

export default {
  props: {
    'position': String,
  },
  data: () => {
    return {
      columnList,
      pagination: { rowsPerPage: 0 },
      toFixed2: utils.toFixed2,
    }
  },
  methods: {
    ...Vuex.mapMutations([
      'setAnnotationList',
    ]),
    handleLabelInput (row) {
      row.color = this.labelOption[row.labelId].color
    },
    handleUp (row) {
      for (let i = 0; i < this.objectAnnotationList.length; i++) {
        if (this.objectAnnotationList[i] === row) {
          if (i - 1 >= 0) {
            this.objectAnnotationList[i] = this.objectAnnotationList.splice(i - 1, 1, this.objectAnnotationList[i])[0]
          }
          break
        }
      }
    },
    handleDown (row) {
      for (let i = 0; i < this.objectAnnotationList.length; i++) {
        if (this.objectAnnotationList[i] === row) {
          if (i + 2 <= this.objectAnnotationList.length) {
            this.objectAnnotationList[i] = this.objectAnnotationList.splice(i + 1, 1, this.objectAnnotationList[i])[0]
          }
          break
        }
      }
    },
    handleDelete (row) {
      utils.confirm('Are you sure to delete this object?').onOk(() => {
        for (let i in this.objectAnnotationList) {
          if (this.objectAnnotationList[i] === row) {
            this.objectAnnotationList.splice(i, 1)
          }
        }
      })
    },
    handleClearAll () {
      if (this.objectAnnotationList.length > 0) {
        utils.confirm('Are you sure to delete ALL objects?').onOk(() => {
          this.setAnnotationList({
            mode: 'object',
            index: this.currentFrame,
            annotationList: [],
          })
        })
      } else {
        utils.notify('There are no objects!')
      }
    },
    focusLast () {
      this.$refs.select.showPopup()
    },
  },
  computed: {
    currentFrame () {
      return eval('this.$store.state.annotation.' + this.position + 'CurrentFrame')
    },
    objectAnnotationList () {
      return this.$store.state.annotation.objectAnnotationListMap[this.currentFrame]
    },
    labelOption () {
      const objectLabelData = this.$store.state.settings.objectLabelData
      let labelOption = []
      for (let objectLabel of objectLabelData) {
        labelOption.push({
          label: objectLabel.name,
          value: objectLabel.id,
          color: objectLabel.color,
        })
      }
      return labelOption
    },
  },
  template: OBJECT_TABLE_TEMPLATE,
}
