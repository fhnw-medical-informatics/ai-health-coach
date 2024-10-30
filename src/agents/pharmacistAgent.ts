import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { createLlm } from '../llm/llm'

import { AIMessage, SystemMessage } from '@langchain/core/messages'
import { RunnableConfig } from '@langchain/core/runnables'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { useMedicineCabinetStore } from '../state/medicineCabinetStore'
import { AgentState } from './types'

export const PHARMACIST_AGENT_NAME = 'pharmacist-agent'

const MEDICATION_OBJECT_SCHEMA = z.object({
  name: z.string(),
  strength: z.string(),
  indication: z.string(),
})

const addMedicationTool = new DynamicStructuredTool({
  name: 'addMedication',
  description: 'Add a medication to the cabinet',
  schema: MEDICATION_OBJECT_SCHEMA,
  func: async (medication) => {
    useMedicineCabinetStore.getState().addMedication(medication)
    return {
      messages: [
        new AIMessage({ content: `Added medication ${medication.name} to cabinet`, name: PHARMACIST_AGENT_NAME }),
      ],
    }
  },
})

const pharmacistAgent = createReactAgent({
  llm: createLlm(),
  tools: [addMedicationTool],
  messageModifier: new SystemMessage(
    `You are a pharmacist who manages a medicine cabinet. 
    Its current contents are: ${JSON.stringify(useMedicineCabinetStore.getState().medications)}. 
    Please provide responsible advice to the patient. 
    When patients buy medications, add them to the cabinet:
    - provide medication strength and indication yourself if not indicated explicitly (ask the patient if ambiguous)
    - avoid duplicates`,
  ),
})

export const pharmacistNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await pharmacistAgent.invoke(state, config)
  const lastMessage = result.messages[result.messages.length - 1]
  return {
    messages: [new AIMessage({ content: lastMessage.content, name: PHARMACIST_AGENT_NAME })],
  }
}
