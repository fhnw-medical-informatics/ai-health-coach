import { JsonOutputToolsParser, ParsedToolCall } from '@langchain/core/output_parsers/openai_tools'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { END } from '@langchain/langgraph/web'
import { z } from 'zod'
import { createLlm } from '../llm/llm'
import { PHARMACIST_AGENT_NAME } from './pharmacistAgent'
import { PSYCHOLOGIST_AGENT_NAME } from './psychologistAgent'

export const SUPERVISOR_AGENT_NAME = 'supervisor'

const members = [PSYCHOLOGIST_AGENT_NAME, PHARMACIST_AGENT_NAME] as const

const systemPrompt =
  'You are a supervisor tasked with managing a conversation between the following workers:' +
  '{members}.' +
  'Given the following user request, respond with the worker to act next.' +
  'Each worker will perform a task and respond with their results and status.' +
  'When finished, respond with FINISH.' +
  'Whenever possible, prefer a workflow which involves just one worker.' +
  'Whenever a worker asks a question, respond with FINISH to pass it to the patient.'

const options = [END, ...members]

const ROUTE_TOOL_NAME = 'route'

const routingTool = {
  name: ROUTE_TOOL_NAME,
  description: 'Select the next role.',
  schema: z.object({
    next: z.enum([END, ...members]),
  }),
}

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  new MessagesPlaceholder('messages'),
  ['system', 'Given the conversation above, who should act next? Or should we FINISH? Select one of: {options}'],
])

const formattedPrompt = await prompt.partial({
  options: options.join(', '),
  members: members.join(', '),
})

export const supervisorChain = formattedPrompt
  .pipe(
    createLlm().bindTools([routingTool], {
      tool_choice: ROUTE_TOOL_NAME,
    }),
  )
  .pipe(new JsonOutputToolsParser())
  .pipe((output: ParsedToolCall[]) => ({
    next: output[0].args.next,
    messages: [],
  }))
