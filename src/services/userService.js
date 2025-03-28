class UserService {
    constructor(repository) {
      this.repository = repository;
    }
  
    async getAllUsers() {
      return this.repository.findAll();
    }
   
    async getUserById(id) {
      const user = await this.repository.findById(id);
      if (!user) throw new Error('User not found');
      return user;
    }
  
    async createUser(userData) {
      if (!userData.name) throw new Error('Name is required');
      return this.repository.create(userData);
    }
  
    async updateUser(id, updateData) {
      await this.getUserById(id); 
      return this.repository.update(id, updateData);
    }
  
    async deleteUser(id) {
      await this.getUserById(id); 
      return this.repository.delete(id);
    }
  }
  
  export default UserService;