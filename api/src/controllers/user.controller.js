import bcrypt from 'bcryptjs';
import { Role, User } from '../models/user.model.js';

// ================== Role Controllers ================== //

const roles = [
    { name: 'admin', description: 'Administrator role with full access' },
    { name: 'collaborator', description: 'Collaborator role with limited access' },
    { name: 'client', description: 'Client role with restricted access' }
];

const seedRoles = async () => {
    try {
        await Role.deleteMany(); // Clear existing roles
        await Role.insertMany(roles); // Insert default roles
        console.log('Roles seeded successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

//   seedRoles();

// Create a new role
export const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if the role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        // Create the role
        const role = new Role({ name, description });
        await role.save();

        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json({ data: roles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific role by ID
export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a role by ID
export const updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true } // Return the updated document and validate input
        );

        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json({ message: 'Role updated successfully', role: updatedRole });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a role by ID
export const deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ================== User Controllers ================== //

// Create a new user
export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the role exists
        const roleExists = await Role.findById(role);
        if (!roleExists) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user
        const user = new User({ username, email, password, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name description').select("-password");
        res.json({ data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all users by role
export const getAllUsersByrole = async (req, res) => {
    try {
        const { role } = req.params; // Extract role from request params
        const users = await User.find({ role }) // Filter users by role
            .populate('role', 'name description')
            .select("-password");

        res.json({ data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a specific user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role', 'name description').select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific user by ID
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("email username");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params; // Assuming user ID is passed as a parameter
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Check if all necessary fields are provided
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if the new password matches the confirmation password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Validate the new password (optional: add your own validation)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Update the password and save the user
        user.password = newPassword;
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the role exists
        if (role) {
            const roleExists = await Role.findById(role);
            if (!roleExists) {
                return res.status(400).json({ message: 'Invalid role' });
            }
        }

        // Hash the password if it's being updated
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, password: hashedPassword, role },
            { new: true, runValidators: true } // Return the updated document and validate input
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};