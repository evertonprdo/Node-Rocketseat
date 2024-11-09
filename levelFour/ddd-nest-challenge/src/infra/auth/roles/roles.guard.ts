import { Reflector } from '@nestjs/core'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { Role } from './role.enum'
import { ROLES_KEYS } from './roles.decorator'

import { UserPayload } from '../jwt.strategy'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEYS, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) return true

    const user = context.switchToHttp().getRequest().user as UserPayload

    const hasRequiredCredentials = requiredRoles.some((item) => {
      if (item === Role.USER && !!user.sub) {
        return true
      }

      if (item === Role.ADMIN && !!user.adminId) {
        return true
      }

      if (item === Role.DELIVERY_WORKER && !!user.deliveryWorkerId) {
        return true
      }

      return false
    })

    return hasRequiredCredentials
  }
}
