import { User } from '@prisma/client'
import { $emitter } from './Emitter'
import { UserChannel } from './UserChannel'

export class Globals {
  private userChannels: UserChannel[] = []

  public getUserChannel(): UserChannel[] {
    return this.userChannels
  }

  public createUserChannelForId(id: string): UserChannel {
    return this.addUserChannel(new UserChannel(id))
  }

  public addUserChannel(bag: UserChannel): UserChannel {
    this.userChannels.push(bag)
    return bag
  }

  public findOrCreateUserChannelByUserId(id: string): UserChannel {
    return (
      this.userChannels.find((bag) => bag.id === id) ??
      this.createUserChannelForId(id)
    )
  }

  public findUserChannelByUserId(id: string): UserChannel | null {
    return this.userChannels.find((bag) => bag.id === id) ?? null
  }

  public removeUserChannel(bag: UserChannel): UserChannel {
    this.userChannels[this.userChannels.indexOf(bag)] = undefined
    return bag
  }

  public clearUserChannels(): void {
    for (const bag of this.userChannels) {
      bag.emitClose()
      this.removeUserChannel(bag)
    }
  }
}

export const $globals = new Globals()
