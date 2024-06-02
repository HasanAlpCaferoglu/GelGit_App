import './css/register.css';
import { Link, useLocation } from 'react-router-dom';

function NonValidRegister() {
    
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark customNavbar">
                <div class="container">
                    <a class="navbar-brand" href="/"><h2>gelgit</h2></a>
                </div>
            </nav>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="login-box mt-5 rounded">
                            <form>
                                <div class="row">
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="name" class="form-label text-start">
                                                <h4>Name</h4>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                class="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="surname" class="form-label text-start">
                                                <h4>Surname</h4>
                                            </label>
                                            <input
                                                type="text"
                                                id="surname"
                                                name="surname"
                                                class="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="tck" class="form-label text-start">
                                                <h4>TCK</h4>
                                            </label>
                                            <input
                                                type="text"
                                                id="tck"
                                                name="tck"
                                                class="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="phone" class="form-label text-start">
                                                <h4>Phone</h4>
                                            </label>
                                            <input
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                class="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="email" class="form-label text-start">
                                                <h4>Email</h4>
                                            </label>
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                class="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="password" class="form-label text-start">
                                                <h4>Password</h4>
                                            </label>
                                            <input
                                                type="text"
                                                id="password"
                                                name="password"
                                                class="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Sign Up</button>
                                </div>
                            </form>

                            <div class="d-grid">
                                <Link to="/login" className="btn btn-primary signup-btn mt-2 text-white"> Login </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NonValidRegister;