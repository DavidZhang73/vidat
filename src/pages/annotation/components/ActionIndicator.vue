<template>
  <div style="overflow-x: hidden">
    <div
      class="action-indicator"
      v-for="(actionTrack, index) in actionTrackList"
      :style="{ 'background-color': q.dark.isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }"
    >
      <div
        :title="`Action: ${action.action}\nStart: ${action.start}\nEnd: ${action.end}\nDuration: ${
          action.end - action.start
        }\nDescription: ${action.description}`"
        class="action"
        v-for="action in actionTrack"
        :style="{
          left: action.leftPercent,
          right: action.rightPercent,
          'background-color': action.color
        }"
        @click="handleClick(action.index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

import utils from '~/libs/utils.js'
import { useAnnotationStore } from '~/store/annotation.js'
import { useConfigurationStore } from '~/store/configuration.js'

const annotationStore = useAnnotationStore()
const configurationStore = useConfigurationStore()
const q = useQuasar()

const actionTrackList = computed(() => {
  if (!annotationStore.video.frames) {
    return [[]]
  }

  const tracks = [[]]
  const markerWidthUnit = 100 / (annotationStore.video.frames - 1)

  annotationStore.actionAnnotationList.forEach((action, index) => {
    const leftFrame = utils.time2index(action.start)
    const rightFrame = utils.time2index(action.end)
    const leftPercent = (leftFrame - 0.5) * markerWidthUnit + '%'
    const rightPercent = (annotationStore.video.frames - rightFrame - 1.5) * markerWidthUnit + '%'

    const actionWithPosition = {
      ...action,
      index,
      leftFrame,
      rightFrame,
      leftPercent,
      rightPercent
    }

    let placed = false
    for (const track of tracks) {
      let overlap = false
      for (const trackAction of track) {
        if (
          !(
            actionWithPosition.rightFrame < trackAction.leftFrame ||
            actionWithPosition.leftFrame > trackAction.rightFrame
          )
        ) {
          overlap = true
          break
        }
      }
      if (!overlap) {
        track.push(actionWithPosition)
        placed = true
        break
      }
    }
    if (!placed) {
      tracks.push([actionWithPosition])
    }
  })
  return tracks
})

const handleClick = (index) => {
  const action = annotationStore.actionAnnotationList[index]
  annotationStore.leftCurrentFrame = utils.time2index(action.start)
  annotationStore.rightCurrentFrame = utils.time2index(action.end)
  if (configurationStore.actionLabelData.find((label) => label.id === action.action).thumbnail) {
    annotationStore.currentThumbnailAction = annotationStore.currentThumbnailAction === action ? null : action
  } else {
    annotationStore.currentThumbnailAction = null
  }
}
</script>

<style>
.action-indicator {
  position: relative;
  height: 8px;
  margin-bottom: 8px;
}

.action-indicator .action {
  position: absolute;
  height: 100%;
  background-blend-mode: multiply;
  cursor: pointer;
}

.action-indicator .action:hover {
  transform: scaleY(1.5);
  transition: transform 0.2s ease-in-out;
}
</style>
