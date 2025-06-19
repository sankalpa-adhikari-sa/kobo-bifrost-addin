function checkFormDeploymentStatus(formData: any) {
  const state = formData;

  // --- Core Deployment Logic (independent of archived status initially) ---

  // Determine if there's any active or recorded deployment.
  // Note: deployment__active can be false if it's undeployed or archived, but has_deployment tells us if it ever was.
  const hasEverHadDeployment = state.has_deployment;
  const hasActiveDeploymentLink = state.deployment__active && state.deployed_versions.count > 0;

  let deployedVersion = null;
  if (hasActiveDeploymentLink && state.deployed_version_id) {
    deployedVersion = state.deployed_versions.results.find(
      (s: any) => s.uid === state.deployed_version_id
    );
  }

  // Check if the current saved version's content hash matches the currently deployed version's hash.
  // This indicates if the 'live' version is the very latest one you've saved.
  const isCurrentVersionContentDeployed =
    hasActiveDeploymentLink &&
    deployedVersion &&
    deployedVersion.content_hash === state.version__content_hash;

  // --- Calculate the main deployment flags ---

  // 1. Form has not had any deployment (needs deployment first time).
  // This is true if has_deployment is explicitly false, meaning it's truly fresh.
  const needsFirstTimeDeployment = !hasEverHadDeployment;

  // 2. Form has undeployed changes.
  // This is true if it *has ever had a deployment* (so not first-time) AND
  // the current content is NOT the one actively deployed.
  const hasUndeployedChanges = hasEverHadDeployment && !isCurrentVersionContentDeployed;

  // 3. Form is deployed but has no undeployed changes.
  // This is true if it has ever had a deployment AND the current content IS the one actively deployed.
  const isDeployedWithNoUndeployedChanges = hasEverHadDeployment && isCurrentVersionContentDeployed;

  // --- Archived status ---
  // A form is archived if its deployment_status explicitly says "archived"
  // and its deployment__active flag is false.
  const isArchived = state.deployment_status === "archived" && state.deployment__active === false;

  // --- Combine and return the results ---
  // When a form is archived, its *primary* state is archived.
  // However, we still want to report if it *also* has undeployed changes.
  return {
    needsFirstTimeDeployment: needsFirstTimeDeployment && !isArchived, // Only true if not archived
    hasUndeployedChanges: hasUndeployedChanges, // This can be true even if archived
    isDeployedWithNoUndeployedChanges: isDeployedWithNoUndeployedChanges && !isArchived, // Only true if not archived
    isArchived: isArchived,
  };
}
