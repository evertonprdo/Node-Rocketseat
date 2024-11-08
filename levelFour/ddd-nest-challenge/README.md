# FastFeet API Challenge

### Application Rules

- [x] The application must have two types of users: deliverer and/or admin.
- [x] It must be possible to log in with CPF and password.
- [x] It must be possible to perform CRUD operations on deliverers.
- [x] It must be possible to perform CRUD operations on orders.
- [x] It must be possible to perform CRUD operations on recipients.
- [x] It must be possible to mark an order as awaiting pickup (Available for withdrawal).
- [x] It must be possible to withdraw an order.
- [x] It must be possible to mark an order as delivered.
- [x] It must be possible to mark an order as returned.
- [x] It must be possible to list orders with delivery addresses near the deliverer's location.
- [x] It must be possible to change a user's password.
- [x] It must be possible to list a user's deliveries.
- [ ] It must be possible to notify the recipient whenever the status of the order changes.

### Business Rules

- [x] Only admin users can perform CRUD operations on orders.
- [x] Only admin users can perform CRUD operations on deliverers.
- [x] Only admin users can perform CRUD operations on recipients.
- [x] To mark an order as delivered, it is mandatory to send a photo.
- [x] Only the deliverer who withdrew the order can mark it as delivered.
- [x] Only the admin can change a user's password.
- [x] A deliverer cannot list another deliverer's orders.
