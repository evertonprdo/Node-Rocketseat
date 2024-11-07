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

    const isValidUser = !requiredRoles.includes(Role.USER) || !!user.sub

    const isValidAdmin = !requiredRoles.includes(Role.ADMIN) || !!user.adminId

    const isValidDeliveryWorker =
      !requiredRoles.includes(Role.DELIVERY_WORKER) || !!user.deliveryWorkerId

    return isValidUser && isValidAdmin && isValidDeliveryWorker
  }
}
