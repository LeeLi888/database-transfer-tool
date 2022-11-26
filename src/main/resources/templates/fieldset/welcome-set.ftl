<fieldset class="card-set active animate__animated animate__fadeIn" id="welcome-set">
    <div class="card-body">
        <h5 class="card-title text-left">
            Welcome to the Database Transfer Wizard
        </h5>
        <p class="mt-4">
            This wizard will assist you in migrating tables and data from a supported database system to another.
        </p>
        <h6>Prerequisites</h6>
        <pre>
Before starting, check the following preparation steps:

- The Migration Wizard uses JDBC to connect to the source database.

- Ensure you can connect to both source and target database servers.

- Make sure you have privileges to read schema information and data from the source database and
create objects and insert data in the target database server.</pre>
    </div>

    <div class="form-card-footer text-center p-3">
        <ul class="actions-footer">
            <li>
                <button type="button" class="btn btn-primary btn-wizard-next" data-next-set="#source-set">
                    Start Database Transfer Wizard
                </button>
            </li>
        </ul>
    </div>
</fieldset>