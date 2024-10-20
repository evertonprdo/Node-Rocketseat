# FastFeet API Challenge

### Application Rules

- [ ] The application must have two types of users: deliverer and/or admin.
- [ ] It must be possible to log in with CPF and password.
- [ ] It must be possible to perform CRUD operations on deliverers.
- [ ] It must be possible to perform CRUD operations on orders.
- [ ] It must be possible to perform CRUD operations on recipients.
- [ ] It must be possible to mark an order as awaiting pickup (Available for withdrawal).
- [ ] It must be possible to withdraw an order.
- [ ] It must be possible to mark an order as delivered.
- [ ] It must be possible to mark an order as returned.
- [ ] It must be possible to list orders with delivery addresses near the deliverer's location.
- [ ] It must be possible to change a user's password.
- [ ] It must be possible to list a user's deliveries.
- [ ] It must be possible to notify the recipient whenever the status of the order changes.

### Business Rules

- [ ] Only admin users can perform CRUD operations on orders.
- [ ] Only admin users can perform CRUD operations on deliverers.
- [ ] Only admin users can perform CRUD operations on recipients.
- [ ] To mark an order as delivered, it is mandatory to send a photo.
- [ ] Only the deliverer who withdrew the order can mark it as delivered.
- [ ] Only the admin can change a user's password.
- [ ] A deliverer cannot list another deliverer's orders.
