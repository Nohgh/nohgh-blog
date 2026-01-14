import { askAction, handleAction } from './lib'

export async function startBlogCli() {
  try {
    const answer = await askAction()
    handleAction(answer)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      if ((error as { message: string }).message.includes('User force closed the prompt')) {
        process.exit(0)
      }
    }
    console.error(error)
    process.exit(1)
  }
}
