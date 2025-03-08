# Injectable use cases

Layer to map repository interfaces from the domain layer to @Injectable() classes in the infra layer. This was implemented so that there is no need to change repository interfaces in the domain layer to abstract classes and use @Injectable() to meet NestJS requirements.
